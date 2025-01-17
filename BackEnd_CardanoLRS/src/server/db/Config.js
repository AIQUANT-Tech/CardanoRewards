import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = async () => {
  try {
    // await mongoose.connect(process.env.DB_CNN);
    await mongoose.connect(
      "mongodb+srv://admin:admin@cardanolrs.s1zd2.mongodb.net/?retryWrites=true&w=majority&appName=CardanoLRS"
    );
    console.log("DB Connection Successful");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnection;
