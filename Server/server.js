import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes       from "./routes/authRoutes.js";
import studentRoutes    from "./routes/studentRoutes.js";
import teacherRoutes    from "./routes/teacherRoutes.js";
import courseRoutes     from "./routes/courseRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import marksRoutes      from "./routes/marksRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth",        authRoutes);
app.use("/api/students",    studentRoutes);
app.use("/api/teachers",    teacherRoutes);
// app.use("/api/courses",     courseRoutes);
app.use("/api/courses", courseRoutes)
app.use("/api/attendance",  attendanceRoutes);
app.use("/api/marks",       marksRoutes);
app.use("/api/assignments", assignmentRoutes);

app.get("/", (req, res) => res.send("🚀 API Running..."));

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
