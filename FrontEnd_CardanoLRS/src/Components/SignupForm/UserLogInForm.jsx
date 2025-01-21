import React, { useState } from "react";
import "./Signup.css"; // Reuse the same styling
import { useNavigate } from "react-router-dom";

const UserSignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleClick = () => {
    navigate("/UserDashBoard");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setError("Enter a valid email address");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <>
      <div className="User-Form" style={{ "--form-bg-color": "#18A7B8" }}>
        {" "}
        <h1 className="sign-text"> Sign In</h1>
        <div className="signup-container">
          <div className="Container">
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Your Email Id"
                className="sign-input"
                value={email}
                onChange={handleEmailChange}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {error && <div className="error-popup">{error}</div>}
            </div>
          </div>
          <div className="Container">
            <input
              type="password"
              placeholder="Enter Your Password"
              className="sign-input"
              value={password}
              onChange={handlePasswordChange}
            ></input>
          </div>
        </div>
        {/* <div className="signup-footer"> */}
        <button
          type="submit"
          onClick={handleClick}
          className="user-submit-button"
          style={{ backgroundColor: "#0E808E" }}
        >
          Sign In
        </button>
        {/* </div> */}
      </div>
    </>
  );
};

export default UserSignInForm;
