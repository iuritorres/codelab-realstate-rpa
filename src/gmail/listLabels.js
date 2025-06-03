import { google } from "googleapis";

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function listLabels(auth) {
  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  const response = await gmail.users.labels.list({
    userId: "me",
  });

  const labels = response.data.labels;

  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }

  console.log("Labels:");
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}
