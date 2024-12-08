import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { injectUser } from "./utils/jwt.js";

import taskRouter from "./Routers/Task.Router.mjs";
import userRouter from "./Routers/User.Router.mjs";
import websiteRouter from "./Routers/Website.Router.mjs";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

// MongoDB connection
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

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Request headers:", req.headers);
  next();
});

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject user into templates
app.use(injectUser);

// Static files
app.use(express.static(path.join(__dirname, "../client/public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", websiteRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  res.status(200).json({
    status: "Server is running",
    dbConnection: states[dbState] || "Unknown",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} ...`);
});
