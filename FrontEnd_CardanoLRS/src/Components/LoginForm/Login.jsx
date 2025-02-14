import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  API_BASE_URL  from "../../config.js";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        loyalty_end_user_login_rq: {
          header: { request_type: "BUSINESS_USER_LOGIN" },
          user_info: { email, password },
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/api/user/loginInfoForBusinessUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (
        response.ok &&
        data.loyalty_business_user_login_rs.status === "success"
      ) {
        // Show success toast
        toast.success("Login successful!");
        sessionStorage.setItem(
          "token",
          JSON.stringify(data.loyalty_business_user_login_rs.token)
        );
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.loyalty_business_user_login_rs.user_info)
        );
        // Navigate to Dashboard
        setTimeout(() => {
          navigate("/Dashboard");
          // window.history.replaceState(null, "", "/SignInPage");
        }, 1500);
      } else {
        // Show error toast
        toast.error(
          data.loyalty_business_user_login_rs.message || "Login failed"
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSignUpNavigation = () => {
    navigate("/SignUpPage");
  };

  useEffect(() => {
    const onBeforeUnload = () => {
      window.history.replaceState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onBeforeUnload);
    };
  }, []);

  return (
    <div className="login-form-container">
      {/* Toastify Container */}
      <ToastContainer />

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin}>
        {/* Email Section */}
        <div className="input-group-signin">
          <label htmlFor="email" className="input-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Your Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Section */}
        <div className="input-group-signin">
          <label htmlFor="password" className="input-label">
            Password:
          </label>
          <div className="password-wrapper" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Your Password"
              className="input-field password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "82%",
                fontSize: "16px",
              }}
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

        {/* Sign In Button */}
        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Additional Links */}
      <div className="additional-links">
        <a href="" className="forgot-password-link">
          Forgot Password?
        </a>
        <span>
          Did not have an account?{" "}
          <a
            href=""
            className="create-account-link"
            onClick={handleSignUpNavigation}
          >
            Create Account
          </a>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
