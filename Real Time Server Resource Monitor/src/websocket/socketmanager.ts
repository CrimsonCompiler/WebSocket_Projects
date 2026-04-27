import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { getSystemMetrics } from "../services/metricsService";

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New Client connected!");

    ws.on("close", () => {
      console.log("Client disconnected.");
    });
  });

  // BroadCasting loop
  setInterval(() => {
    getSystemMetrics((metrics) => {
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(metrics));
        }
      });
    });
  }, 1000);
};
