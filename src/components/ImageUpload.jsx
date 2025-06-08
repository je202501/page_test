import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

//이미지 변경하기
const ImageUpload = ({ refrigerator_id }) => {
  const inputRef = useRef(null);
  const handleFileClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  //이미지 변경하기
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();

      formData.append("image", file);
      formData.append("refrigerator_id", refrigerator_id);
      // console.log("유저 이미지 교체 중");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button className="action-btn" onClick={handleFileClick}>
        이미지 변경
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
    </div>
  );
};

export default ImageUpload;
