import express from "express";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();

// Create & Get All Students
router
  .route("/")
  .post(
    protect,
    authorizeRoles("admin"),
    createStudent
  )
  .get(
    protect,
    authorizeRoles("admin", "teacher"),
    getAllStudents
  );

// Get By ID, Update & Delete
router
  .route("/:id")
  .get(
    protect,
    getStudentById
  )
  .put(
    protect,
    authorizeRoles("admin"),
    updateStudent
  )
  .delete(
    protect,
    authorizeRoles("admin"),
    deleteStudent
  );

export default router;