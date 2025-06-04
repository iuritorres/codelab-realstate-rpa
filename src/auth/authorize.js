import { authenticate } from "@google-cloud/local-auth";
import { CREDENTIALS_PATH, SCOPES } from "../constants/index.js";
import { loadSavedCredentialsIfExist } from "./loadSavedCredentialsIfExist.js";
import { saveCredentials } from "./saveCredentials.js";

/**
 * Load or request or authorization to call APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();

  if (client) {
    return client;
  }

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}
