import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PDF_PASSWORD: z.string().length(3),
  NOTION_TOKEN: z.string(),
  NOTION_REALSTATE_DATABASE_ID: z.string(),
});

export const env = envSchema.parse(process.env);
