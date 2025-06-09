import { PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";
import { getSubscriptionPolicy } from "./getSubscriptionPolicy";

export async function setSubscriptionPolicy(pubSubClient: PubSub) {
  const subscriptionPermissions = await getSubscriptionPolicy(pubSubClient);

  const hasEditorRole = subscriptionPermissions.bindings?.some(
    (binding) => binding.role === "roles/pubsub.editor"
  );

  if (hasEditorRole) {
    console.log(
      "✅ Subscription already has 'roles/pubsub.editor' role. No changes made."
    );

    return;
  }

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

  console.log(
    "Updated policy for subscription:",
    JSON.stringify(updatedPolicy.bindings, null, 2)
  );
}
