import React from "react";
import "./sign.css";
import SignupForm from "../../../Components/SignupForm/Signup";
const SignUpPage = () => {
  return (
    <div className="SignUp-Container">
      <h1 className="Text">Create Your Account</h1>
      <div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
