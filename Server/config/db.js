import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb Connected`)
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
    }
};

export default connectDB;