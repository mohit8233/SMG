import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    file:        { type: String, default: "" },
    teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    studentId:   { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    status:      { type: String, enum: ["pending", "submitted"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
