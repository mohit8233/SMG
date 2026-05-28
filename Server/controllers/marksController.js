import Marks from "../models/Marks.js";
import Student from "../models/Student.js";

// Add marks
export const addMarks = async (req, res, next) => {
  try {
    const { studentId, subject, marks } = req.body;
    if (!studentId || !subject || marks === undefined)
      return res.status(400).json({ success: false, message: "All fields required" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const markRecord = await Marks.findOneAndUpdate(
      { studentId, subject },
      { studentId, subject, marks, addedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: "Marks Added Successfully", marks: markRecord });
  } catch (error) { next(error); }
};

// Get all marks (teacher/admin)
export const getAllMarks = async (req, res, next) => {
  try {
    const marks = await Marks.find()
      .populate({ path: "studentId", populate: { path: "userId", select: "name email" } })
      .populate("addedBy", "name");
    res.status(200).json({ success: true, count: marks.length, marks });
  } catch (error) { next(error); }
};

// Get marks for a student
export const getStudentMarks = async (req, res, next) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId });
    const avg = marks.length ? Math.round(marks.reduce((s, m) => s + m.marks, 0) / marks.length) : 0;
    res.status(200).json({ success: true, stats: { totalSubjects: marks.length, average: avg }, marks });
  } catch (error) { next(error); }
};

// Delete marks
export const deleteMarks = async (req, res, next) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    if (!marks) return res.status(404).json({ success: false, message: "Marks not found" });
    res.status(200).json({ success: true, message: "Marks Deleted" });
  } catch (error) { next(error); }
};
