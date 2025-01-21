import React from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import ProfileCard from "../../../Components/ProfileCard/ProfileCard";
import "./Profile.css";

const Profile = () => {
  const profileData = {
    name: "John Doe",
    contactNumber: "+1234567890",
    email: "johndoe@example.com",
    publicKey: "0x12345678ABCDEF",
  };

  return (
    <>
      <Header title="Profile" />
      <div className="Profile-css">
        <AdminSideBar />
        <div className="Profile-main-body">
          <ProfileCard profileData={profileData} />
        </div>
      </div>
    </>
  );
};

export default Profile;
