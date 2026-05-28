import express from "express";
import { createAssignment, getAllAssignments, getStudentAssignments, submitAssignment, deleteAssignment } from "../controllers/assignmentController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.post("/",                    protect, authorizeRoles("admin", "teacher"), upload.single("file"), createAssignment);
router.get("/",                     protect, authorizeRoles("admin", "teacher"), getAllAssignments);
router.get("/student/:studentId",   protect, getStudentAssignments);
router.put("/:id/submit",           protect, authorizeRoles("student"), upload.single("file"), submitAssignment);
router.delete("/:id",               protect, authorizeRoles("admin", "teacher"), deleteAssignment);
export default router;
