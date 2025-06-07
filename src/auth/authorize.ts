import { authenticate } from "@google-cloud/local-auth";
import { CREDENTIALS_PATH, SCOPES } from "../constants";
import { loadSavedCredentialsIfExist } from "./loadSavedCredentialsIfExist";
import { saveCredentials } from "./saveCredentials";

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
