import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value === "") {
      setError("");
    } else if (!emailRegex.test(value)) {
      setError("Enter a valid email address");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (value === "") {
      setError("");
    } else if (!passwordRegex.test(value)) {
      setError(
        "Password must be at least 6 characters long, contain an uppercase letter, a digit, and a special character"
      );
    } else {
      setError("");
    }
  };

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value);

    if (value === "") {
      setError("This field cannot be empty");
    } else {
      setError("");
    }
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            wallet_address: "",
            role: "Business User",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        toast.success(data.message); // Toastify success message
        setTimeout(() => navigate("/SignInPage"), 2000);
      } else {
        setError(data.message || "Signup failed");
        toast.error(data.message || "Signup failed"); // Toastify error message
      }
    } catch (err) {
      setError("An error occurred while signing up");
      toast.error("An error occurred while signing up"); // Toastify error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="Form">
      <h1 className="sign-text">Sign Up</h1>
      <form className="signup-container" onSubmit={handleSignup}>
        {/* First Name */}
        <div className="Container">
          <input
            type="text"
            placeholder="Enter Your First Name"
            className="sign-input"
            value={firstName}
            onChange={(e) => handleInputChange(e, setFirstName)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="Container">
          <input
            type="text"
            placeholder="Enter Your Last Name"
            className="sign-input"
            value={lastName}
            onChange={(e) => handleInputChange(e, setLastName)}
            required
          />
        </div>

        {/* Email */}
        <div className="Container">
          <input
            type="email"
            placeholder="Enter Your Email Id"
            className="sign-input"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Password */}
        <div className="Container">
          {/* Password Section */}
          <div className="input-group-signup">
            <div className="password-wrapper" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Your Password"
                className="sign-input"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? (
                  <Eye className="eye-icon" />
                ) : (
                  <EyeOff className="eye-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error or Success Messages */}
        {error && <div className="error-popup">{error}</div>}
        {successMessage && (
          <div className="success-popup">{successMessage}</div>
        )}

        {/* Submit Button */}
        <div className="signup-footer">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <div>
            <span className="submit-button-next">Already have an account?</span>
            <button
              type="button"
              className="submit-button-next2"
              onClick={() => navigate("/SignInPage")}
            >
              Sign In
            </button>
          </div>
        </div>
      </form>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
