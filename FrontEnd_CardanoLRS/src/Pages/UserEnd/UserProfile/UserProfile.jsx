import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserProfile.css";
import ProfileCard from "../../../Components/ProfileCard/ProfileCard";
const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    contactNumber: "",
    email: "",
  });

  const nav = useNavigate();

  useEffect(() => {

    const userData = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!token) {
      nav("/UserSignIn");
    }


    if (userData) {
      setProfileData({
        name: userData.username || "Default Name",
        tier: userData.tier.tier_name,
        email: userData.email || "default@example.com",
      });
    }
  }, [nav]);

  return (
    <>
      <Header
        title="Profile"
        backgroundColor={"#18A7B8"}
        showWalletIcon={false}
      />
      <div className="UserProfile">
        <UserSideBar />
        <div className="UserProfile-main-body">
          <ProfileCard profileData={profileData} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
