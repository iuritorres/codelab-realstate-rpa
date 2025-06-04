import { gmail } from "../index.js";

export async function getLabels() {
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
