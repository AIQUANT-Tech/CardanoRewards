// import React, { useState, useEffect } from "react";
// import Header from "../../Components/Header/header";
// import AdminSideBar from "../../Components/SideBar/AdminSideBar";
// import "./Profile.css";
// import { FilePenLine } from "lucide-react";

// const Profile = () => {
//   const predefinedImages = [
//     "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg", // Example image 1
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GQuewxLfMh2olMxwVIVsJmu1qFf5Q4dwZw&s", // Example image 2
//     "https://endertech.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Ffswbkokbwqb5%2F4vBAsCbQ9ITwI7Ym0MtXgY%2F96c4ec25d505f1b702f46a5a3d9dbe77%2FAI-Article-00.png&w=3840&q=75", // Example image 3
//     "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX", // Example image 4
//     "https://www.adobe.com/in/products/firefly/features/media_179810889bf1ef34a453137e0387dd9e0f4e43f05.jpeg?width=750&format=jpeg&optimize=medium", // Example image 5
//     "https://framerusercontent.com/images/m10TNJG9BGUJGrbspgZAN2xE6U.jpg", // Example image 6
//     "https://i0.wp.com/www.smartprix.com/bytes/wp-content/uploads/2024/04/cover.png?ssl=1&quality=80&w=f", // Example image 7
//     "https://www.willbhurd.com/wp-content/uploads/2023/01/DALL%C2%B7E-2024-01-07-08.01.49-An-eye-catching-and-informative-lead-image-for-a-blog-about-artificial-intelligence-for-beginners.-The-image-should-visually-represent-the-concept-of-.png", // Example image 8
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXL9_NeDeHo98975Mfj9K2DBbPW2an-lHkhA&s", // Example image 9
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZQZxwf5q5vh-nultmTgpZlE1nlmEdkxMcKN_qyB-NCMP0v3Z8rsWTklmhZkN14HMPRXg&usqp=CAU", // Example image 10
//   ];

//   const getRandomImage = () => {
//     const randomIndex = Math.floor(Math.random() * predefinedImages.length);
//     return predefinedImages[randomIndex];
//   };

//   const [profileImage, setProfileImage] = useState(getRandomImage()); // Set a random image on initial render

//   return (
//     <>
//       <Header title="Profile" />
//       <div className="Profile-css">
//         <AdminSideBar />
//         <div className="Profile-main-body">
//           <div className="Profile-Container">
//             <div className="Profile-Image-Container">
//               <img src={profileImage} className="Profile-Image" />
//             </div>

//             <div className="Profile-Details-Container">
//               <div className="Profile-Card">
//                 <div className="Profile-Content">
//                   <p>
//                     <strong>Name:</strong> John Doe
//                   </p>
//                   <p>
//                     <strong>Contact Number:</strong> +1234567890
//                   </p>
//                   <p>
//                     <strong>Email Id:</strong> johndoe@example.com
//                   </p>
//                   <p>
//                     <strong>Public Key:</strong> 0x12345678ABCDEF
//                   </p>
//                 </div>
//                 <button className="Profile-Edit-Button">
//                   <FilePenLine />
//                   Edit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;

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
