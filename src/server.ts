import express from "express";
import { subscribeToGmailPushNotifications } from "./google/gmail/utils/watch";
import { setupPubSub } from "./google/pubsub/setupPubSub";
import { webhookRouter } from "./routes";

const server = express();

server.use(express.json());

server.use("/webhook", webhookRouter);

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  await setupPubSub();
  await subscribeToGmailPushNotifications();

  console.log(`Server running on port ${port}.`);
});
