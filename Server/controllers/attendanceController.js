import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// Mark attendance
export const markAttendance = async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;
    if (!studentId || !date || !status)
      return res.status(400).json({ success: false, message: "All fields required" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const attendance = await Attendance.findOneAndUpdate(
      { studentId, date },
      { studentId, date, status, markedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    // Update attendance % on student
    const total   = await Attendance.countDocuments({ studentId });
    const present = await Attendance.countDocuments({ studentId, status: "present" });
    await Student.findByIdAndUpdate(studentId, { attendence: Math.round((present / total) * 100) });

    res.status(200).json({ success: true, message: "Attendance Marked", attendance });
  } catch (error) { next(error); }
};

// Get attendance for a student
export const getStudentAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
    const total   = attendance.length;
    const present = attendance.filter(a => a.status === "present").length;
    const absent  = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    res.status(200).json({
      success: true,
      stats: { total, present, absent, percentage },
      attendance,
    });
  } catch (error) { next(error); }
};

// Get attendance by date (teacher view)
export const getAttendanceByDate = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ date: req.params.date })
      .populate({ path: "studentId", populate: { path: "userId", select: "name email" } });
    res.status(200).json({ success: true, count: attendance.length, attendance });
  } catch (error) { next(error); }
};
