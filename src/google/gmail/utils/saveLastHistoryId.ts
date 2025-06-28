import fs from "fs";
import path from "path";
import { cwd } from "process";

export const saveLastHistoryId = async (historyId: string) => {
  const filePath = path.join(cwd(), "lastHistoryId.txt");

  try {
    fs.writeFileSync(filePath, historyId, "utf8");
    console.log(`✅ Last history ID saved: ${historyId}`);
  } catch (error) {
    console.error("❌ Error saving last history ID:", error);
  }
};
