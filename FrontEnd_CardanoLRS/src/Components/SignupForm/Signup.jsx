// import React, { useState } from "react";
// import "./Signup.css";
// import { useNavigate } from "react-router-dom";
// const SignupForm = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [focused, setFocused] = useState(false);

//   const handleClick = () => {
//     navigate("/SignInPage");
//   };

//   const setUpPage1 = () => {
//     navigate("/SetupPage1");
//   };
//   const [mobile, setMobile] = useState("");

//   const handleInputChange = (e) => {
//     const value = e.target.value;

//     // Only allow digits (0-9) and limit to 10 characters
//     if (/^\d{0,10}$/.test(value)) {
//       setMobile(value);
//     }
//   };
//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);

//     // Regular expression for email validation
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(value)) {
//       setError("Enter a valid email address");
//     } else {
//       setError("");
//     }
//   };

//   const handleFocus = () => {
//     setFocused(true);
//   };

//   const handleBlur = () => {
//     setFocused(false);
//   };

//   return (
//     <>
//       <div className="Form">
//         <h1 className="sign-text"> Sign Up</h1>
//         <div className="signup-container">
//           <div className="Container">
//             <div className="input-container">
//               <input
//                 type="text"
//                 placeholder="Enter Your Email Id"
//                 className="sign-input"
//                 value={email}
//                 onChange={handleEmailChange}
//                 required
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//               {error && <div className="error-popup">{error}</div>}
//             </div>
//           </div>
//           <div className="Container">
//             <input
//               type="password"
//               placeholder="Enter Your Password"
//               className="sign-input"
//             ></input>
//           </div>
//           <div className="Container-mobile">
//             <input
//               type="text"
//               placeholder="Enter Your Mobile Number"
//               className="sign-input"
//               maxLength="10"
//               pattern="\d{10}"
//               value={mobile}
//               onChange={handleInputChange}
//             ></input>
//           </div>
//         </div>

//         <div className="signup-footer">
//           <button type="submit" className="submit-button" onClick={setUpPage1}>
//             Sign Up
//           </button>
//           <div>
//             <a className="submit-button-next">Already have an account? </a>
//             <a href="" className="submit-button-next2" onClick={handleClick}>
//               Sign In
//             </a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignupForm;

import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
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
        setTimeout(() => navigate("/SignInPage"), 2000); // Redirect after success
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred while signing up");
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
            onChange={(e) => handleInputChange(e, setEmail)}
            required
          />
        </div>

        {/* Password */}
        <div className="Container">
          <input
            type="password"
            placeholder="Enter Your Password"
            className="sign-input"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
            required
          />
        </div>

        {/* Error or Success Messages */}
        {error && <div className="error-popup">{error}</div>}
        {successMessage && (
          <div className="success-popup">{successMessage}</div>
        )}

        {/* Submit Button */}
        <div className="signup-footer">
          <button type="submit" className="submit-button">
            Sign Up
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
    </div>
  );
};

export default SignupForm;
