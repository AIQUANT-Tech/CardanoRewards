import React, { useState } from "react";
import "./ImageUploader.css";

const ImageUploader = ({ defaultImage, size = 150, onImageChange }) => {
  const [imageSrc, setImageSrc] = useState(defaultImage);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Update the image preview
        if (onImageChange) {
          onImageChange(file); // Pass the file back to the parent
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="ImageUploader-Container"
      style={{ width: size, height: size }}
    >
      <label htmlFor="image-upload" className="ImageUploader-Label">
        <img
          src={imageSrc}
          alt="User Profile"
          className="ImageUploader-Image"
        />
        <input
          type="file"
          id="image-upload"
          className="ImageUploader-Input"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
