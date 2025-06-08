import { PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";

export async function setSubscriptionPolicy(pubSubClient: PubSub) {
  const newPolicy = {
    bindings: [
      {
        role: "roles/pubsub.editor",
        members: ["group:cloud-logs@google.com"],
      },
      {
        role: "roles/pubsub.viewer",
        members: ["allUsers"],
      },
    ],
  };

  const [updatedPolicy] = await pubSubClient
    .subscription(env.GOOGLE_PUBSUB_SUBSCRIPTION)
    .iam.setPolicy(newPolicy);

  console.log("Updated policy for subscription: %j", updatedPolicy.bindings);
}
