import { unsubscribeFromGmailPushNotifications } from "../google/gmail/utils/watch";

unsubscribeFromGmailPushNotifications().catch((error) => {
  console.error(error);
  process.exit(1);
});
