import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", authRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "StreamSpace API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
