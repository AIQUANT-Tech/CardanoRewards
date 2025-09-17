import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = async () => {
  try {
    // await mongoose.connect(process.env.DB_CNN);
    // await mongoose.connect(
    //   "mongodb+srv://admin:admin@cardanolrs.s1zd2.mongodb.net/?retryWrites=true&w=majority&appName=CardanoLRS"
    // );
    await mongoose.connect("mongodb://13.203.191.101:27017/LRS", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connection Successful");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnection;
