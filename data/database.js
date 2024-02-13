import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "ToDo",
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDB;
