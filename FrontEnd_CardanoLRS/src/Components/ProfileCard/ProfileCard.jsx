import React from "react";
import { FilePenLine } from "lucide-react";
import ProfileImage from "./ProfileImage";
import "../../Pages/BusinessEnd/Profile/Profile.css";

const ProfileCard = ({ profileData }) => {
  const { name, contactNumber, email, publicKey } = profileData;

  return (
    <div className="Profile-Container">
      <ProfileImage />
      <div className="Profile-Details-Container">
        <div className="Profile-Card">
          <div className="Profile-Content">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Contact Number:</strong> {contactNumber}
            </p>
            <p>
              <strong>Email Id:</strong> {email}
            </p>
            {publicKey && ( // Conditionally render the public key
              <p>
                <strong>Public Key:</strong> {publicKey}
              </p>
            )}
          </div>
          <button className="Profile-Edit-Button">
            <FilePenLine />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
