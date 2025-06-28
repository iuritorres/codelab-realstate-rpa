import { Router } from "express";
import { env } from "../env";
import { getGmailClient } from "../google/gmail/client";
import { getLastHistoryId } from "../google/gmail/utils/getLastHistoryId";
import { getNegotiationsLabel } from "../google/gmail/utils/getNegotiationsLabel";
import { saveLastHistoryId } from "../google/gmail/utils/saveLastHistoryId";
import { RealStateCategory } from "../notion/enums/notion";
import { createInvestmentRecord } from "../notion/utils/createInvestmentRecord";
import { getInvestmentAmountFromPDF } from "../utils/getInvestmentAmountFromPDF";

export const webhookRouter = Router();

webhookRouter.post("/gmail", async (request, response) => {
  console.log("\n📩 Gmail Webhook Event Received!");
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

  const lastHistoryId = await getLastHistoryId();

  const historyResponse = await gmail.users.history.list({
    userId: "me",
    startHistoryId: lastHistoryId,
    labelId: negotiationsLabel.id!,
    historyTypes: ["messageAdded"],
  });

  await saveLastHistoryId(historyResponse.data.historyId!);

  const histories = historyResponse.data.history || [];

  for (const history of histories) {
    const messages = history.messages || [];
    console.log(`📜 ${messages.length} new messages found in history.`);

    for (const message of messages) {
      const messageData = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
      });

      const headers = messageData.data.payload?.headers || [];
      const labels = messageData.data.labelIds || [];
      const subject =
        headers.find((key) => key.name === "Subject")?.value || "(sem título)";

      if (!labels.includes(negotiationsLabel.id!)) {
        continue;
      }

      console.log("📝 New negotiation email found:", subject);

      const parts = messageData.data.payload?.parts || [];
      const pdfPart = parts.find(
        (part) =>
          part.filename?.endsWith(".pdf") &&
          part.mimeType === "application/pdf" &&
          part.body?.attachmentId
      );

      if (!pdfPart) {
        console.error("❌ PDF attachment not found in email.");
        continue;
      }

      const attachmentId = pdfPart.body?.attachmentId!;
      const attachment = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: message.id!,
        id: attachmentId,
      });

      const dataBase64 = attachment.data?.data;
      if (!dataBase64) {
        console.error("❌ No data found in attachment.");
        continue;
      }

      const pdfBuffer = Buffer.from(dataBase64, "base64");
      const pdfData = new Uint8Array(pdfBuffer);

      const investmentAmount = await getInvestmentAmountFromPDF({
        pdfData,
        password: env.PDF_PASSWORD,
      });

      await createInvestmentRecord({
        category: RealStateCategory.INVESTMENT,
        amount: investmentAmount,
        date: new Date(), // change it to get the date from the pdf
      });

      await gmail.users.messages.modify({
        userId: "me",
        id: message.id!,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });
    }
  }
});
