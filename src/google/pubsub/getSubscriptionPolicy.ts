import { Policy, PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";

export async function getSubscriptionPolicy(pubSubClient: PubSub) {
  const [policy]: [Policy] = await pubSubClient
    .subscription(env.GOOGLE_PUBSUB_SUBSCRIPTION)
    .iam.getPolicy();

  return policy;
}
