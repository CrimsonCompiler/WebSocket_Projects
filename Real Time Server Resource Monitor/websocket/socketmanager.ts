import http from "http";
import { WebSocketServer } from "ws";

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocketServer) => {
    console.log("New Client connected!");
    wss.on("close", () => {
      console.log("Client disconnected..");
    });
  });
};
