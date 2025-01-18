// import React, { useState } from "react";
// import "./Login.css";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false); // For loading state
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const requestBody = {
//         loyalty_end_user_login_rq: {
//           header: { request_type: "END_USER_LOGIN" },
//           user_info: { email, password },
//         },
//       };

//       const response = await fetch(
//         "http://localhost:5000/api/user/loginInfoForEndUser",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok && data.loyalty_end_user_login_rs.status === "success") {
//         // Handle successful login
//         alert("Login successful!");
//         console.log(data.loyalty_end_user_login_rs.user_info);
//         navigate("/Dashboard"); // Redirect to home page or any other page
//       } else {
//         // Handle failure response
//         alert(data.loyalty_end_user_login_rs.message || "Login failed");
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Error during login:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const handleSignUpNavigation = () => {
//     navigate("/SignUpPage");
//   };

//   return (
//     <div className="login-form-container">
//       <form onSubmit={handleLogin}>
//         {/* Email Section */}
//         <div className="input-group-signin">
//           <label htmlFor="email" className="input-label">
//             Email:
//           </label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter Your Email"
//             className="input-field"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         {/* Password Section */}
//         <div className="input-group-signin">
//           <label htmlFor="password" className="input-label">
//             Password:
//           </label>
//           <div className="password-wrapper" style={{ position: "relative" }}>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               placeholder="Enter Your Password"
//               className="input-field password-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={{
//                 width: "82%",
//                 fontSize: "16px",
//               }}
//               required
//             />
//             <button
//               type="button"
//               className="toggle-password"
//               onClick={togglePasswordVisibility}
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 background: "transparent",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {showPassword ? (
//                 <Eye className="eye-icon" />
//               ) : (
//                 <EyeOff className="eye-icon" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Sign In Button */}
//         <button type="submit" className="signin-button" disabled={loading}>
//           {loading ? "Signing In..." : "Sign In"}
//         </button>
//       </form>

//       {/* Additional Links */}
//       <div className="additional-links">
//         <a href="" className="forgot-password-link">
//           Forgot Password?
//         </a>
//         <span>
//           Did not have an account?{" "}
//           <a
//             href=""
//             className="create-account-link"
//             onClick={handleSignUpNavigation}
//           >
//             Create Account
//           </a>
//         </span>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

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
          header: { request_type: "END_USER_LOGIN" },
          user_info: { email, password },
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/user/loginInfoForEndUser",
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

      if (response.ok && data.loyalty_end_user_login_rs.status === "success") {
        // Show success toast
        toast.success("Login successful!");
        console.log(data.loyalty_end_user_login_rs.user_info);

        // Navigate to Dashboard
        setTimeout(() => navigate("/Dashboard"), 1500); // Navigate after a slight delay
      } else {
        // Show error toast
        toast.error(data.loyalty_end_user_login_rs.message || "Login failed");
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

  return (
    <div className="login-form-container">
      {/* Toastify Container */}
      <ToastContainer />

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
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
