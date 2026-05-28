import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject:   { type: String, required: true, trim: true },
    marks:     { type: Number, required: true, min: 0, max: 100 },
    addedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Marks", marksSchema);
