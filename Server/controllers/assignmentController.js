import Assignment from "../models/Assignment.js";
import Teacher from "../models/Teacher.js";

// Create assignment
export const createAssignment = async (req, res, next) => {
  try {
    const { title, description, studentId } = req.body;
    if (!title || !studentId)
      return res.status(400).json({ success: false, message: "Title and student required" });

    // Find teacher profile linked to logged-in user
    const teacher = await Teacher.findOne({ userId: req.user._id });

    const assignment = await Assignment.create({
      title,
      description,
      file:      req.file ? req.file.filename : "",
      teacherId: teacher?._id || null,
      studentId,
      status:    "pending",
    });
    res.status(201).json({ success: true, message: "Assignment Uploaded", assignment });
  } catch (error) { next(error); }
};

// Get all assignments (teacher/admin)
export const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate({ path: "studentId", populate: { path: "userId", select: "name email" } })
      .populate({ path: "teacherId", populate: { path: "userId", select: "name" } });
    res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (error) { next(error); }
};

// Get assignments for a student
export const getStudentAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ studentId: req.params.studentId })
      .populate({ path: "teacherId", populate: { path: "userId", select: "name" } });
    res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (error) { next(error); }
};

// Submit assignment (student)
export const submitAssignment = async (req, res, next) => {
  try {
    const update = { status: "submitted" };
    if (req.file) update.file = req.file.filename;

    const assignment = await Assignment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, message: "Assignment Submitted", assignment });
  } catch (error) { next(error); }
};

// Delete assignment
export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, message: "Assignment Deleted" });
  } catch (error) { next(error); }
};
