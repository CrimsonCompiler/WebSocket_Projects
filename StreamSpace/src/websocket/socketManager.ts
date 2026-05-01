import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import url from "url";
import http from "http";

interface JWTPAYLOAD {
  id: number;
  username: string;
  email: string;
}

export const setupWebSocket = async (server: http.Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const baseURL = `http://${request.headers.host}`;
    const parsedUrl = new URL(request.url || "", baseURL);
    const token = parsedUrl.searchParams.get("token");

    // DEBUG 1: Token asche kina check kora
    console.log("🔍 Received Token in URL:", token ? "Yes" : "No");

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        // DEBUG 2: Token vul hole error ki asche?
        console.log("❌ JWT Verification Failed:", err.message);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      // DEBUG 3: Token thik thakle
      console.log("✅ JWT Verified! User Data:", decoded);

      (request as any).user = decoded;
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
  });
  return wss;
};
