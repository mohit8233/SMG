import mongoose from "mongoose";


const studentSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rollNumber:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        course:{
            type: String,
            required: true,
            trim: true,
        },
        semester:{
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        attendence:{
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;