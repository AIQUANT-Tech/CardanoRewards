import React, { useState } from "react";
import "../../Pages/BusinessEnd/Profile/Profile.css";

const predefinedImages = [
  "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GQuewxLfMh2olMxwVIVsJmu1qFf5Q4dwZw&s",
  "https://endertech.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Ffswbkokbwqb5%2F4vBAsCbQ9ITwI7Ym0MtXgY%2F96c4ec25d505f1b702f46a5a3d9dbe77%2FAI-Article-00.png&w=3840&q=75",
  "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX",
  "https://www.adobe.com/in/products/firefly/features/media_179810889bf1ef34a453137e0387dd9e0f4e43f05.jpeg?width=750&format=jpeg&optimize=medium",
  "https://framerusercontent.com/images/m10TNJG9BGUJGrbspgZAN2xE6U.jpg",
  "https://i0.wp.com/www.smartprix.com/bytes/wp-content/uploads/2024/04/cover.png?ssl=1&quality=80&w=f",
  "https://www.willbhurd.com/wp-content/uploads/2023/01/DALL%C2%B7E-2024-01-07-08.01.49-An-eye-catching-and-informative-lead-image-for-a-blog-about-artificial-intelligence-for-beginners.-The-image-should-visually-represent-the-concept-of-.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXL9_NeDeHo98975Mfj9K2DBbPW2an-lHkhA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZQZxwf5q5vh-nultmTgpZlE1nlmEdkxMcKN_qyB-NCMP0v3Z8rsWTklmhZkN14HMPRXg&usqp=CAU",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * predefinedImages.length);
  return predefinedImages[randomIndex];
};

const ProfileImage = () => {
  const [profileImage, setProfileImage] = useState(getRandomImage());

  return (
    <div className="Profile-Image-Container">
      <img src={profileImage} alt="Profile" className="Profile-Image" />
    </div>
  );
};

export default ProfileImage;
