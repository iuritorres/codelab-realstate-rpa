import { join } from "path";
import { cwd } from "process";

export const TOKEN_PATH = join(cwd(), "token.json");
export const CREDENTIALS_PATH = join(cwd(), "credentials.json");
