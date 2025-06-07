import { env } from "./env";
import { NEGOTIATION_NOTES_LABEL } from "./google/constants/gmail";
import { getGmailClient } from "./google/gmail/client";
import { getLabels } from "./google/gmail/utils/getLabels";
import { RealStateCategory } from "./notion/enums/notion";
import { createInvestmentRecord } from "./notion/utils/createInvestmentRecord";
import { getInvestmentAmountFromPDF } from "./utils/getInvestmentAmountFromPDF";

(async () => {
  const gmail = await getGmailClient();

  const labels = await getLabels({ gmail });

  const negotiationsLabel = labels.filter(
    (label) => label.name === NEGOTIATION_NOTES_LABEL
  );

  if (!negotiationsLabel[0]) {
    throw new Error("XP Operations Label not found");
  }

  const mailId = await gmail.users.messages
    .list({
      userId: "me",
      labelIds: [negotiationsLabel[0].id!],
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

  const getPDFfromMail = "";

  // ----------------------------------------------------------------------
  const negotiationNotes = Buffer.from(negotiationNotesPDF.data, "base64");

  const investmentAmount = await getInvestmentAmountFromPDF({
    pdfData: new Uint8Array(negotiationNotes),
    password: env.PDF_PASSWORD,
  });

  await createInvestmentRecord({
    source: "RPA",
    category: RealStateCategory.INVESTMENT,
    amount: investmentAmount,
    date: new Date(),
  });
})();
