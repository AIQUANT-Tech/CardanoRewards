import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import ProfileCard from "../../../Components/ProfileCard/ProfileCard";
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState({
      name: "",
      tier: "",
      email: "",
    });

      useEffect(() => {
    
        const userData = JSON.parse(sessionStorage.getItem("user"));
    
        if (userData) {
          setProfileData({
            name: userData.username || "Default Name",
            tier: "Business",
            email: userData.email || "default@example.com",
          });
        }
      }, []);

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
