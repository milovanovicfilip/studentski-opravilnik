import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { Task } from './Models/Task.Model.mjs';
import { fileURLToPath } from "url";
import taskRouter from "./Routes/Task.Router.mjs";
import userRouter from "./Routes/User.Router.mjs";
import websiteRouter from "./Routes/Website.Router.mjs";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

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

app.use(
  cors({
    origin: ["http://localhost:8080", "https://localhost:5500"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, '../client/public')));

// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', websiteRouter);



app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter)


// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

  res.status(200).json({
    status: "Server is running",
    dbConnection: states[dbState] || "Unknown",
  });
});


// Shrani dokument v bazo
const savedTask = await newTask.save();
console.log("Vzorec je bil uspešno vnešen:", savedTask);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} ...`);
});
