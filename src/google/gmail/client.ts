import { google } from "googleapis";
import { authorize } from "../auth/authorize";

export const getGmailClient = async () => {
  const oauth2Client = await authorize();

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
};
