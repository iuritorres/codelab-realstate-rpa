import { gmail_v1 } from "googleapis";
import { NEGOTIATION_NOTES_LABEL } from "../../constants/gmail";
import { getLabels } from "./getLabels";

interface GetLabelsParams {
  gmail: gmail_v1.Gmail;
}

export async function getNegotiationsLabel({ gmail }: GetLabelsParams) {
  const labels = await getLabels({ gmail });

  const negotiationsLabel = labels.find(
    (label) => label.name === NEGOTIATION_NOTES_LABEL
  );

  if (!negotiationsLabel?.id) {
    throw new Error("XP Operations Label not found");
  }

  return negotiationsLabel;
}
