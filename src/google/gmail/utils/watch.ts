import { env } from "../../../env";
import { getGmailClient } from "../client";
import { getNegotiationsLabel } from "./getNegotiationsLabel";

(async () => {
  const gmail = await getGmailClient();
  const negotiationsLabel = await getNegotiationsLabel({ gmail });

  const watchResponse = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: `projects/${env.GOOGLE_PROJECT_ID}/topics/${env.GOOGLE_PUBSUB_TOPIC}`,
      labelIds: [negotiationsLabel.id!],
      labelFilterAction: "include",
    },
  });

  console.log("Watch started:", watchResponse.data);
})();
