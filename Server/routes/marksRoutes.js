import express from "express";
import { addMarks, getAllMarks, getStudentMarks, deleteMarks } from "../controllers/marksController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.post("/",              protect, authorizeRoles("admin", "teacher"), addMarks);
router.get("/",               protect, authorizeRoles("admin", "teacher"), getAllMarks);
router.get("/:studentId",     protect, getStudentMarks);
router.delete("/:id",         protect, authorizeRoles("admin", "teacher"), deleteMarks);
export default router;
