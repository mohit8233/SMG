import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

// Create Teacher
export const createTeacher = async (req, res, next) => {
  try {
    const { userId, subject, experience } = req.body;

    if (!userId || !subject || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingTeacher = await Teacher.findOne({ userId });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Teacher profile already exists",
      });
    }

    const teacher = await Teacher.create({ userId, subject, experience });

    // ✅ User role "teacher" set karo - login maa correct role male
    await User.findByIdAndUpdate(userId, { role: "teacher" });

    res.status(201).json({
      success: true,
      message: "Teacher Added Successfully",
      teacher,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Teachers
export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate(
      "userId",
      "name email phone profilePic"
    );

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    next(error);
  }
};

// Get Teacher By ID
export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "userId",
      "name email phone profilePic"
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

// Update Teacher
export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email phone profilePic");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher Updated Successfully",
      teacher,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Linked user account pan delete karo
    await User.findByIdAndDelete(teacher.userId);

    res.status(200).json({
      success: true,
      message: "Teacher Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};