import { google } from "googleapis";
import { authorize } from "./auth/authorize";
import { XPI_OPERATIONS_LABEL } from "./constants";
import { getLabels } from "./gmail/getLabels";
import { promises as fs } from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { RealStateCategory } from "./constants/notion";
import { notion } from "./notion/client";
import { env } from "./env";

(async () => {
  // ############## Gmail API Code ##############
  const client = await authorize();

  const gmail = google.gmail({
    version: "v1",
    auth: client,
  });

  const labels = await getLabels({ gmail });

  if (!labels) {
    throw new Error("No labels found in Gmail.");
  }

  const xpiOperationsLabel = labels.filter(
    (label) => label.name === XPI_OPERATIONS_LABEL
  );

  if (!xpiOperationsLabel[0]) {
    throw new Error("XP Operations Label not found");
  }

  const mailId = await gmail.users.messages
    .list({
      userId: "me",
      labelIds: [xpiOperationsLabel[0].id!],
    })
    .then((response) => response.data.messages?.[0].id);

  if (!mailId) {
    throw new Error("No mail found with the specified label.");
  }

  const mail = await gmail.users.messages
    .get({
      userId: "me",
      id: mailId,
    })
    .then((response) => response.data);

  if (!mail.id || !mail.payload || !mail.payload.parts) {
    throw new Error("Mail payload or parts not found.");
  }

  const attachmentData = mail.payload.parts[1];

  if (
    !attachmentData ||
    !attachmentData.body ||
    !attachmentData.body.attachmentId
  ) {
    throw new Error("Attachment data or attachment ID not found.");
  }

  const negotiationNotesPDF = await gmail.users.messages.attachments
    .get({
      userId: "me",
      messageId: mail.id,
      id: attachmentData.body.attachmentId,
    })
    .then((response) => response.data);

  if (!negotiationNotesPDF.data) {
    throw new Error("Negotiation notes PDF data not found.");
  }

  await fs.writeFile(
    "negotiation_notes.pdf",
    Buffer.from(negotiationNotesPDF.data, "base64")
  );

  // ############## PDF Processing Code ##############
  const negotiationNotes = await fs.readFile("negotiation_notes.pdf");
  const pdfUint8Array = new Uint8Array(negotiationNotes);

  const document = await getDocument({
    data: pdfUint8Array,
    password: env.PDF_PASSWORD,
  }).promise;

  const page = await document.getPage(1);
  const data = await page.getTextContent();

  const amountLabel = data.items.find(
    (item): item is import("pdfjs-dist/types/src/display/api").TextItem =>
      "str" in item &&
      typeof item.str === "string" &&
      item.str.includes("Líquido para")
  );

  let amountValue: string | undefined = undefined;

  if (amountLabel) {
    const amountLabelIndex = data.items.indexOf(amountLabel);
    const prevItem = data.items[amountLabelIndex - 1];

    if ("str" in prevItem && typeof prevItem.str === "string") {
      amountValue = prevItem.str
        .replace("R$", "")
        .replace(".", "")
        .replace(",", ".")
        .trim();
    } else {
      throw new Error(
        "Previous item is not a TextItem or missing 'str' property."
      );
    }
  } else {
    throw new Error("Amount label not found in PDF text content.");
  }

  console.log("Amount Value:", amountValue);

  // ############## Notion API Code ##############
  await notion.pages.create({
    parent: {
      database_id: env.NOTION_REALSTATE_DATABASE_ID,
    },
    properties: {
      Source: {
        title: [
          {
            text: {
              content: "RPA",
            },
          },
        ],
      },
      Category: {
        select: {
          name: RealStateCategory.INVESTMENT,
        },
      },
      Amount: {
        number: Number(amountValue),
      },
      Date: {
        type: "date",
        date: {
          start: new Date().toISOString().slice(0, 10),
        },
      },
    },
  });
})();
