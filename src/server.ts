import express from "express";
import {
  subscribeToGmailPushNotifications,
  unsubscribeFromGmailPushNotifications,
} from "./google/gmail/utils/watch";
import { setupPubSubTopicAndSubscription } from "./google/pubsub/setupPubSubTopicAndSubscription";
import { webhookRouter } from "./routes";

const server = express();

server.use(express.json());

server.use("/webhook", webhookRouter);

const PORT = 3000;
server.listen(PORT, async () => {
  await setupPubSubTopicAndSubscription();
  await subscribeToGmailPushNotifications();

  console.log(`Server running on port ${PORT}.`);
});

const shutdown = async () => {
  console.log(
    "⏹️  Shutting down server, unsubscribing from Gmail push notifications..."
  );

  try {
    await unsubscribeFromGmailPushNotifications();
  } catch (error) {
    console.error("Error unsubscribing from Gmail push notifications:", error);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
