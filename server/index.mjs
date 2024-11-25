import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { Task } from './Models/Task.Model.mjs'
import { fileURLToPath } from "url";
import taskRouter from "./Routes/Task.Router.mjs";
import userRouter from "./Routes/User.Router.mjs"

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
app.use("/api/tasks", taskRouter);
app.use("api/user", userRouter)

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

  res.status(200).json({
    status: "Server is running",
    dbConnection: states[dbState] || "Unknown",
  });
});
const newTask = new Task({
  title: "Dokončaj projekt",
  content: "Dokončati moram nalogo za šolo do konca tedna.",
  status: "in-progress",
  priority: "high",
  dueDate: new Date("2024-11-25"),
  tags: ["šola", "projekt"],
});

// Shrani dokument v bazo
const savedTask = await newTask.save();
console.log("Vzorec je bil uspešno vnešen:", savedTask);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server listening on https://localhost:${PORT} ...`);
});
