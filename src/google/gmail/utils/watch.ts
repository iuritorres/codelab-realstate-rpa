import { env } from "../../../env";
import { getGmailClient } from "../client";
import { getNegotiationsLabel } from "./getNegotiationsLabel";

export const subscribeToGmailPushNotifications = async () => {
  const gmail = await getGmailClient();
  const negotiationsLabel = await getNegotiationsLabel({ gmail });

  await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: `projects/${env.GOOGLE_PROJECT_ID}/topics/${env.GOOGLE_PUBSUB_TOPIC}`,
      labelIds: [negotiationsLabel.id!],
      labelFilterAction: "include",
    },
  });

  console.log("📬 Subscribed to Gmail push notifications.");
};

export const unsubscribeFromGmailPushNotifications = async () => {
  const gmail = await getGmailClient();

  await gmail.users.stop({
    userId: "me",
  });

  console.log("📭 Unsubscribed from Gmail push notifications.");
};
