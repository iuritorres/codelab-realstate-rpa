// import { google } from "googleapis";
// import { authorize } from "./auth/authorize.js";
// import { XPI_OPERATIONS_LABEL } from "./constants/gmail.js";
// import { getLabels } from "./gmail/getLabels.js";
import "dotenv/config";
import { promises as fs } from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// const client = await authorize();

// export const gmail = google.gmail({
//   version: "v1",
//   auth: client,
// });

// const labels = await getLabels();

// const xpiOperationsLabel = labels.filter(
//   (label) => label.name === XPI_OPERATIONS_LABEL
// );

// if (!xpiOperationsLabel[0]) {
//   throw new Error("XP Operations Label not found");
// }

// const mailId = await gmail.users.messages
//   .list({
//     userId: "me",
//     labelIds: [xpiOperationsLabel[0].id],
//   })
//   .then((response) => response.data.messages[0].id);

// const mail = await gmail.users.messages
//   .get({
//     userId: "me",
//     id: mailId,
//   })
//   .then((response) => response.data);

// const attachmentData = mail.payload.parts[1];

// const negotiationNotesPDF = await gmail.users.messages.attachments
//   .get({
//     userId: "me",
//     messageId: mail.id,
//     id: attachmentData.body.attachmentId,
//   })
//   .then((response) => response.data);

// fs.writeFile(
//   "negotiation_notes.pdf",
//   Buffer.from(negotiationNotesPDF.data, "base64")
// );

const negotiationNotes = await fs.readFile("negotiation_notes.pdf");
const pdfBuffer = Buffer.from(negotiationNotes, "base64");
const pdfUint8Array = new Uint8Array(pdfBuffer);

const document = await getDocument({
  data: pdfUint8Array,
  password: process.env.PDF_PASSWORD,
}).promise;

const page = await document.getPage(1);
const data = await page.getTextContent();

const amountLabel = data.items.find((item) =>
  item.str.includes("Líquido para")
);

const amountLabelIndex = data.items.indexOf(amountLabel);
const amountValue = data.items[amountLabelIndex - 1];

console.log(amountLabel);
console.log(amountValue);
