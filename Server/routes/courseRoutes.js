import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

 const courseRoutes = express.Router();

courseRoutes
  .route("/")
  .post(protect, authorizeRoles("admin"), createCourse)
  .get(protect, getAllCourses); // admin + teacher + student all see courses

courseRoutes.route("/:id")
  .get(protect, getCourseById)
  .put(protect, authorizeRoles("admin"), updateCourse)
  .delete(protect, authorizeRoles("admin"), deleteCourse);

  export default courseRoutes;
