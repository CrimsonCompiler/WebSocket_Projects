import express, { Application } from "express";
import http from "http";
import { setupWebSocket } from "./websocket/socketmanager";

const app: Application = express();
const server = http.createServer(app);

// websocket server
setupWebSocket(server);

const PORT: number = 3000;
server.listen(PORT, () => {
  console.log(`Modular TS Server is running on http://localhost:${PORT}`);
});
