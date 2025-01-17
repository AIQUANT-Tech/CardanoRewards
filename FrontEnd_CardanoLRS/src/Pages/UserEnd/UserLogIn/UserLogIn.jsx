import React from "react";
import UserSignInForm from "./../../../Components/SignupForm/UserLogInForm";
import "./UserLogIn.css";
const UserLogIn = () => {
  return (
    <div className="UserLogIn-Main">
      <h1 className="Text">Create Your Account</h1>
      <UserSignInForm />
    </div>
  );
};

export default UserLogIn;
