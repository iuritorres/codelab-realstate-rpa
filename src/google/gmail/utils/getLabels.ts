import { gmail_v1 } from "googleapis";

interface GetLabelsParams {
  gmail: gmail_v1.Gmail;
}

export const getLabels = async ({ gmail }: GetLabelsParams) => {
  const response = await gmail.users.labels.list({
    userId: "me",
  });

  const labels = response.data.labels;

  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return [];
  }

  return labels;
};
