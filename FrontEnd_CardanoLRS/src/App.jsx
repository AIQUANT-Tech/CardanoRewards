import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/BusinessEnd/SignInPage/LandingPage.jsx";

import SignUpPage from "./Pages/BusinessEnd/SignUpPage/SignUpPage.jsx";
import Dashboard from "./Pages/BusinessEnd/Dashboard/Dashboard.jsx";
import CustomerList from "./Pages/BusinessEnd/Customers/CustomerList.jsx";

import FirstSetup from "./Pages/BusinessEnd/FirstSetupPage/FirstSetupPage.jsx";
import SecondSetup from "./Pages/BusinessEnd/FirstSetupPage/SecondSetupPage.jsx";
import ThirdSetup from "./Pages/BusinessEnd/FirstSetupPage/ThirdSetupPage.jsx";
import Setup from "./Pages/BusinessEnd/Setup/Setup.jsx";
import UserDashBoard from "./Pages/UserEnd/UserDashBoard/UserDashBoard.jsx";
import UserProfile from "./Pages/UserEnd/UserProfile/UserProfile.jsx";
import UserWallet from "./Pages/UserEnd/UserWallet/UserWallet.jsx";

import UserWallet2 from "./Pages/UserEnd/UserWallet/UserWallet2.jsx";
import UserLogIn from "./Pages/UserEnd/UserLogIn/UserLogIn.jsx";
import Profile from "./Pages/BusinessEnd/Profile/Profile.jsx";
import SignInPage from "./Pages/BusinessEnd/SignInPage/SignInPage.jsx";
import TierSetup from "./Pages/BusinessEnd/FirstSetupPage/TierSetup.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Business" element={<LandingPage />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CustomerList" element={<CustomerList />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/SetupPage1" element={<FirstSetup />} />
        <Route path="/SetupPage2" element={<TierSetup />} />
        <Route path="/SetupPage3" element={<SecondSetup />} />
        <Route path="/SetupPage4" element={<ThirdSetup />} />
        <Route path="/Setup" element={<Setup />} />

        {/* User routes */}
        <Route path="/UserDashBoard" element={<UserDashBoard />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/UserWallet" element={<UserWallet />} />
        <Route path="/UserWallet2" element={<UserWallet2 />} />
        <Route path="/UserSignIn" element={<UserLogIn />} />
      </Routes>
    </Router>
  );
};

export default App;
