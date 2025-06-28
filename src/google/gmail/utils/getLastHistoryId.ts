import fs from "fs";
import path from "path";
import { cwd } from "process";

export const getLastHistoryId = async () => {
  const filePath = path.join(cwd(), "lastHistoryId.txt");

  const historyFileExists = fs.existsSync(filePath);

  if (historyFileExists) {
    const data = fs.readFileSync(filePath, "utf8");
    return data.trim();
  }
};
