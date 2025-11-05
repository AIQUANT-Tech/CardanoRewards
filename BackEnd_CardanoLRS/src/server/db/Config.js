import mongoose from "mongoose";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    // await mongoose.connect(
    //   "mongodb+srv://admin:admin@cardanolrs.s1zd2.mongodb.net/?retryWrites=true&w=majority&appName=CardanoLRS"
    // );
  //  const ssmClient = new SSMClient({
  //    region: process.env.AWS_REGION
  //  });
   
  //  const command = new GetParameterCommand({
  //    Name: process.env.PARAMETER_STORE_NAME,
  //    WithDecryption: true, 
  //  });
  //  const response = await ssmClient.send(command);
  //  const mongoUrl = response.Parameter?.Value;
  //  console.log("SSM Parameter Store Response:", response);

  //  console.log("Retrieved MongoDB URL from Parameter Store", mongoUrl);
   

  //  if (!mongoUrl) {
  //    throw new Error("MongoDB URL not found in AWS Parameter Store");
  //  }

  //   await mongoose.connect(mongoUrl, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
    console.log("DB Connection Successful");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnection;
