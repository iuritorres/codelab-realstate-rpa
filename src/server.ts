import express from "express";
import { subscribeToGmailPushNotifications } from "./google/gmail/utils/watch";
import { setupPubSubTopicAndSubscription } from "./google/pubsub/setupPubSubTopicAndSubscription";
import { webhookRouter } from "./routes";

const server = express();

server.use(express.json());

server.use("/webhook", webhookRouter);

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  await setupPubSubTopicAndSubscription();
  await subscribeToGmailPushNotifications();

  console.log(`Server running on port ${port}.`);
});
