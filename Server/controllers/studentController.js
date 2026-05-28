import Student from "../models/Student.js";
import User from "../models/User.js";

export const createStudent = async (req, res, next) => {
  try {
    const { userId, rollNumber, course, semester } = req.body;

    // Validation
    if (!userId || !rollNumber || !course || !semester) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Check User Exists
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check Existing Student
    const existingStudent = await Student.findOne({ userId });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists",
      });
    }

    // Create Student
    const student = await Student.create({
      userId,
      rollNumber,
      course,
      semester,
    });

    // ✅ User role "student" set karo - login maa correct role male
    await User.findByIdAndUpdate(userId, { role: "student" });

    // Success Response
    res.status(201).json({
      success: true,
      message: "Student Added Successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate(
      "userId",
      "name email phone profilePic"
    );

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// Get Student By ID
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "userId",
      "name email phone profilePic"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email phone profilePic");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Also delete the linked user account
    await User.findByIdAndDelete(student.userId);

    res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};