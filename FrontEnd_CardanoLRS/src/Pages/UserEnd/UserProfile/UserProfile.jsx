import React, { useEffect, useState } from "react";
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

  useEffect(() => {

    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (userData) {
      setProfileData({
        name: userData.username || "Default Name",
        tier: userData.tier.tier_name,
        email: userData.email || "default@example.com",
      });
    }
  }, []);

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
