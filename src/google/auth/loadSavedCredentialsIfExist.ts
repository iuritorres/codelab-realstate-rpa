import { promises as fs } from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { TOKEN_PATH } from "../constants/credentials";

export async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());

    const jsonClient = google.auth.fromJSON(credentials);

    return jsonClient as OAuth2Client;
  } catch (error) {
    return null;
  }
}
