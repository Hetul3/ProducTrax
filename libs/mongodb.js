import mongoose from "mongoose";

const connectMongoDB = async () => {
    console.log("this should world");
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("ghwoghweofeojo connected");
    } catch(error) {
        console.log("didn't work nooo", error);
    }
}

export default connectMongoDB;