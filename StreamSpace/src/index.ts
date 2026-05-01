import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/index.js";
import { setupWebSocket } from "./websocket/socketManager.js";
import http from "http";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http server
const server = http.createServer(app);    

// Routes
app.use("/api/v1", authRouter);

// Websocket
setupWebSocket(server);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "StreamSpace API is running" });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
