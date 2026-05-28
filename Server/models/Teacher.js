import mongoose from "mongoose";


const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject:{
            type: String,
            required: true,
            trim: true,
        },
        experience:{
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;