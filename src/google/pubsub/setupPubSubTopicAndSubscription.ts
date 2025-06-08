import { PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";
import { getSubscriptionPolicy } from "./getSubscriptionPolicy";
import { setSubscriptionPolicy } from "./setSubscriptionPolicy";

export async function setupPubSubTopicAndSubscription() {
  const pubsub = new PubSub({ projectId: env.GOOGLE_PROJECT_ID });

  const [topic] = await pubsub
    .topic(env.GOOGLE_PUBSUB_TOPIC)
    .get({ autoCreate: true });

  const [subscription] = await topic
    .subscription(env.GOOGLE_PUBSUB_SUBSCRIPTION)
    .get({ autoCreate: true });

  const subscriptionPermissions = await getSubscriptionPolicy(pubsub);

  const hasEditorRole = subscriptionPermissions.bindings?.some(
    (binding) => binding.role === "roles/pubsub.editor"
  );

  if (!hasEditorRole) {
    await setSubscriptionPolicy(pubsub);
  }

  subscription.on("message", (message) => {
    console.log("Received message:", message.data.toString());
    process.exit(0);
  });

  subscription.on("error", (error) => {
    console.error("Received error:", error);
    process.exit(1);
  });

  topic.publishMessage({
    data: Buffer.from("Test message!"),
  });
}
