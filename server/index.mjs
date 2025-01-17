import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import taskRouter from "./Routers/Task.Router.mjs";
import userRouter from "./Routers/User.Router.mjs";
import websiteRouter from "./Routers/Website.Router.mjs";
import notificationRoutes from './Routers/Notification.Router.mjs';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) =>
    console.error("Failed to connect to MongoDB Atlas:", err.message)
  );

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Store this in .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      ttl: 24 * 60 * 60, // 1 day session expiry
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);

// Middleware
app.use(cors({ origin: ["http://localhost:8080"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to pass session user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "../client/public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/", websiteRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);
app.use('/api/notifications', notificationRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

  res.status(200).json({
    status: "Server is running",
    dbConnection: states[dbState] || "Unknown",
  });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
