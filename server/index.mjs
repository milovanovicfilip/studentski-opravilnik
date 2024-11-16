import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import taskRoutes from "./Routes/Task.Routes.mjs";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT;

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
  cors({
    origin: "https://localhost:5500",
  })
);
app.use("/api/tasks", taskRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

  res.status(200).json({
    status: "Server is running",
    dbConnection: states[dbState] || "Unknown",
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on https://localhost:${PORT} ...`);
});
