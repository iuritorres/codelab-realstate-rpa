import express from "express";
import { webhookRouter } from "./routes";

const server = express();

server.use(express.json());

server.use("/webhook", webhookRouter);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
