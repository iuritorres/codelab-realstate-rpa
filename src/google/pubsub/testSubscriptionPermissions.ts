import { PubSub } from "@google-cloud/pubsub";
import { env } from "../../env";

export async function testSubscriptionPermissions(pubSubClient: PubSub) {
  const permissionsToTest = [
    "pubsub.subscriptions.consume",
    "pubsub.subscriptions.update",
  ];

  const [permissions] = await pubSubClient
    .subscription(env.GOOGLE_PUBSUB_SUBSCRIPTION)
    .iam.testPermissions(permissionsToTest);

  console.log("Tested permissions for subscription: %j", permissions);
}
