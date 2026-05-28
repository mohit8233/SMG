import express from "express";
import { markAttendance, getStudentAttendance, getAttendanceByDate } from "../controllers/attendanceController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.post("/",               protect, authorizeRoles("admin", "teacher"), markAttendance);
router.get("/date/:date",      protect, authorizeRoles("admin", "teacher"), getAttendanceByDate);
router.get("/:studentId",      protect, getStudentAttendance);
export default router;
