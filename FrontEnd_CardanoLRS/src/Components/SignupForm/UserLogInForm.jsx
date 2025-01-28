import React, { useState } from "react";
import "./Signup.css"; // Reuse the same styling
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    // Clear previous error
    setError("");
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/loginInfoForEndUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loyalty_end_user_login_rq: {
              header: {
                product: "LRS",
                request_type: "END_USER_LOGIN",
              },
              user_info: {
                email: email,
                password: password,
              },
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.loyalty_end_user_login_rs.status === "success") {
        toast.success("Login successful!");
        sessionStorage.setItem(
          "token",
          JSON.stringify(data.loyalty_end_user_login_rs.token)
        );
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.loyalty_end_user_login_rs.user_info)
        );

        setIsLoading(false);
        navigate("/UserDashboard");
        // window.history.replaceState(null, "", "/SignInPage");
      } else {
        setIsLoading(false);
        toast.error("An error occurred while signing in");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred while signing in");
      toast.error("An error occurred while signing in");
      console.error("Error:", err);
    }
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
      <ToastContainer />
      <div className="User-Form" style={{ "--form-bg-color": "#18A7B8" }}>
        <h1 className="sign-text">Sign In</h1>
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
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={handleClick}
          className="user-submit-button"
          disabled={isLoading}
          style={{ backgroundColor: "#0E808E" }}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserSignInForm;
