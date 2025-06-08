import { Router } from "express";
import { getGmailClient } from "../google/gmail/client";
import { getNegotiationsLabel } from "../google/gmail/utils/getNegotiationsLabel";

export const webhookRouter = Router();

webhookRouter.post("/gmail", async (request, response) => {
  console.log("📩 Gmail Webhook Event Received");
  response.sendStatus(200);

  const { message } = request.body;
  if (!message || !message.data) {
    console.error("❌ Invalid message data");
    return;
  }

  const decodedData = JSON.parse(
    Buffer.from(message.data, "base64").toString("utf-8")
  );

  const historyId = decodedData.historyId;
  if (!historyId) {
    console.error("❌ No historyId in data");
    return;
  }

  const TEST_LABEL_ID = "Label_8363703479154201157";
  const gmail = await getGmailClient();
  const negotiationsLabel = await getNegotiationsLabel({ gmail });

  const historyResponse = await gmail.users.history.list({
    userId: "me",
    startHistoryId: historyId,
    labelId: TEST_LABEL_ID,
    historyTypes: ["messageAdded"],
  });

  const histories = historyResponse.data.history || [];

  for (const history of histories) {
    const messages = history.messages || [];

    for (const message of messages) {
      const messageData = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "metadata",
        metadataHeaders: ["Subject", "LabelIds"],
      });

      const subjectHeader = messageData.data.payload?.headers?.find(
        (history) => history.name === "Subject"
      );

      const subject = subjectHeader?.value || "(sem título)";
      const labels = messageData.data.labelIds || [];

      if (!labels.includes(negotiationsLabel.id!)) {
        continue;
      }

      console.log("📝 Novo e-mail de negociação:", subject);
    }
  }
});
