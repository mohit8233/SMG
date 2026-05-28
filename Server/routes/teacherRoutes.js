import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createTeacher)
  .get(protect, authorizeRoles("admin"), getAllTeachers);

router
  .route("/:id")
  .get(protect, getTeacherById)
  .put(protect, authorizeRoles("admin"), updateTeacher)
  .delete(protect, authorizeRoles("admin"), deleteTeacher);

export default router;