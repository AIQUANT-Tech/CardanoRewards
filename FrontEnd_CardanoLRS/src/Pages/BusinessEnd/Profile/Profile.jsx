import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import ProfileCard from "../../../Components/ProfileCard/ProfileCard";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    tier: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {

    const userData = JSON.parse(sessionStorage.getItem("user"));

    const token = sessionStorage.getItem("token");

     if(!token){
       navigate("/SignInPage");
     }

    if (userData) {
      setProfileData({
        name: userData.username || "Default Name",
        tier: "Business",
        email: userData.email || "default@example.com",
      });
    }
  }, [navigate]);

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
