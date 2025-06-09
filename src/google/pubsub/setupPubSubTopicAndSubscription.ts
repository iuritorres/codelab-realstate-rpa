import { PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";
import { setSubscriptionPolicy } from "./setSubscriptionPolicy";

export async function setupPubSubTopicAndSubscription() {
  const pubsub = new PubSub({ projectId: env.GOOGLE_PROJECT_ID });

  const [topic] = await pubsub
    .topic(env.GOOGLE_PUBSUB_TOPIC)
    .get({ autoCreate: true });

  const [subscriptions] = await topic.getSubscriptions();

  if (Boolean(subscriptions.length)) {
    console.log("✅ Subscription already exists. No changes made.");
    await setSubscriptionPolicy(pubsub);

    return;
  }

  await topic.createSubscription(env.GOOGLE_PUBSUB_SUBSCRIPTION, {
    ackDeadlineSeconds: 60,
    pushConfig: {
      pushEndpoint: env.GOOGLE_PUBSUB_PUSH_ENDPOINT,
    },
    expirationPolicy: {
      ttl: null,
    },
  });

  await setSubscriptionPolicy(pubsub);

  console.log("✅ Successfully created Pub/Sub topic and subscription.");
  console.log(
    `🔗 Push endpoint is set to "${env.GOOGLE_PUBSUB_PUSH_ENDPOINT}".`
  );
}
