import { promises as fs } from "fs";
import { google } from "googleapis";
import { TOKEN_PATH } from "../constants/index.js";

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
export async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);

    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
