import { google } from "googleapis";
import { authorize } from "./auth/authorize.js";
import { XPI_OPERATIONS_LABEL } from "./constants/gmail.js";
import { getLabels } from "./gmail/getLabels.js";

const client = await authorize();

export const gmail = google.gmail({
  version: "v1",
  auth: client,
});

const labels = await getLabels();

const xpiOperationsLabel = labels.filter(
  (label) => label.name === XPI_OPERATIONS_LABEL
);

if (!xpiOperationsLabel[0]) {
  throw new Error("XP Operations Label not found");
}

const mailId = await gmail.users.messages
  .list({
    userId: "me",
    labelIds: [xpiOperationsLabel[0].id],
  })
  .then((response) => response.data.messages[0].id);

const mail = await gmail.users.messages
  .get({
    userId: "me",
    id: mailId,
  })
  .then((response) => response.data);

const attachmentData = mail.payload.parts[1];

const negotiationNotesPDF = await gmail.users.messages.attachments
  .get({
    userId: "me",
    messageId: mail.id,
    id: attachmentData.body.attachmentId,
  })
  .then((response) => response.data);

console.log(negotiationNotesPDF);
