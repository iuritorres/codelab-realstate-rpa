import { promises as fs } from "fs";
import { OAuth2Client } from "google-auth-library";
import { CREDENTIALS_PATH, TOKEN_PATH } from "../constants/credentials";

export async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH);

  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  await fs.writeFile(TOKEN_PATH, payload);
}
