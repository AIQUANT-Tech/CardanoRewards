import React from "react";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserProfile.css";
import ProfileCard from "../../../Components/ProfileCard/ProfileCard";
const UserProfile = () => {
  const profileData = {
    name: "Srijit Sarkar",
    contactNumber: "+1234567890",
    email: "srijitsarkar@example.com",
    // publicKey: "0x12345678ABCDEF",
  };

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
