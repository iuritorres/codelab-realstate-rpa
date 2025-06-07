import { gmail_v1 } from "googleapis";

export async function getLabels({ gmail }: { gmail: gmail_v1.Gmail }) {
  const response = await gmail.users.labels.list({
    userId: "me",
  });

  const labels = response.data.labels;

  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }

  return labels;
}
