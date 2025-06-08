import express from "express";
import { PubSub } from "@google-cloud/pubsub";
import { env } from "./env";
import { NEGOTIATION_NOTES_LABEL } from "./google/constants/gmail";
import { getGmailClient } from "./google/gmail/client";
import { getLabels } from "./google/gmail/utils/getLabels";
import { getNegotiationsLabel } from "./google/gmail/utils/getNegotiationsLabel";
import { webhookRouter } from "./routes";
// import { getSubscriptionPolicy } from "./google/pubsub/getSubscriptionPolicy";
// import { setSubscriptionPolicy } from "./google/pubsub/setSubscriptionPolicy";
// import { RealStateCategory } from "./notion/enums/notion";
// import { createInvestmentRecord } from "./notion/utils/createInvestmentRecord";
// import { getInvestmentAmountFromPDF } from "./utils/getInvestmentAmountFromPDF";

// (async () => {
//   const gmail = await getGmailClient();

//   const labels = await getLabels({ gmail });

//   const negotiationsLabel = labels.filter(
//     (label) => label.name === NEGOTIATION_NOTES_LABEL
//   );

//   if (!negotiationsLabel[0]) {
//     throw new Error("XP Operations Label not found");
//   }

//   const mailId = await gmail.users.messages
//     .list({
//       userId: "me",
//       labelIds: [negotiationsLabel[0].id!],
//     })
//     .then((response) => response.data.messages?.[0].id);

//   if (!mailId) {
//     throw new Error("No mail found with the specified label.");
//   }

//   const mail = await gmail.users.messages
//     .get({
//       userId: "me",
//       id: mailId,
//     })
//     .then((response) => response.data);

//   if (!mail.id || !mail.payload || !mail.payload.parts) {
//     throw new Error("Mail payload or parts not found.");
//   }

//   const attachmentData = mail.payload.parts[1];

//   if (
//     !attachmentData ||
//     !attachmentData.body ||
//     !attachmentData.body.attachmentId
//   ) {
//     throw new Error("Attachment data or attachment ID not found.");
//   }

//   const negotiationNotesPDF = await gmail.users.messages.attachments
//     .get({
//       userId: "me",
//       messageId: mail.id,
//       id: attachmentData.body.attachmentId,
//     })
//     .then((response) => response.data);

//   if (!negotiationNotesPDF.data) {
//     throw new Error("Negotiation notes PDF data not found.");
//   }

//   const getPDFfromMail = "";

//   // ----------------------------------------------------------------------
//   const negotiationNotes = Buffer.from(negotiationNotesPDF.data, "base64");

//   const investmentAmount = await getInvestmentAmountFromPDF({
//     pdfData: new Uint8Array(negotiationNotes),
//     password: env.PDF_PASSWORD,
//   });

//   await createInvestmentRecord({
//     source: "RPA",
//     category: RealStateCategory.INVESTMENT,
//     amount: investmentAmount,
//     date: new Date(),
//   });
// })();

async function setupPubSubTopicAndSubscription() {
  // const pubsub = new PubSub({ projectId: env.GOOGLE_PROJECT_ID });
  //
  // const [topic] = await pubsub
  //   .topic(env.GOOGLE_PUBSUB_TOPIC)
  //   .get({ autoCreate: true });
  //
  // const [subscription] = await topic
  //   .subscription(env.GOOGLE_PUBSUB_SUBSCRIPTION)
  //   .get({ autoCreate: true });
  //
  // const subscriptionPermissions = await getSubscriptionPolicy(pubsub);
  //
  // const hasEditorRole = subscriptionPermissions.bindings?.some(
  //   (binding) => binding.role === "roles/pubsub.editor"
  // );
  //
  // if (!hasEditorRole) {
  //   await setSubscriptionPolicy(pubsub);
  // }
  //
  // gmail
  //   .users()
  //   .watch((userId = "me"), (body = request))
  //   .execute();
  //
  // subscription.on("message", (message) => {
  //   console.log("Received message:", message.data.toString());
  //   process.exit(0);
  // });
  //
  // subscription.on("error", (error) => {
  //   console.error("Received error:", error);
  //   process.exit(1);
  // });
  //
  // topic.publishMessage({
  //   data: Buffer.from("Test message!"),
  // });
}

const server = express();

server.use(express.json());

server.use("/webhook", webhookRouter);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
