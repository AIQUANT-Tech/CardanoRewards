import React from "react";

import LSecond from "../../../assets/LSecond.png";
import LThird from "../../../assets/LThird.jpg";

import LoginForm from "../../../Components/LoginForm/Login";

const SignInPage = () => {
  return (
    <div className="SignIn-Container">
      <div className="First-Div">
        <div className="logo-section">
          <img src={LSecond} alt="Nothing" width={200} />
        </div>
        <div className="Image-SignIn">
          <img src={LThird} alt="Nothing" className="Image-SignIn-img" />
        </div>
      </div>
      <div className="Second-Div">
        <h1 className="Welcome-Back">Welcome Back</h1>
        <h1 className="Sign-In">Sign In</h1>

        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
