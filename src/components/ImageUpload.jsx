import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ImageUpload = () => {
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

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();

      formData.append('image', file);
      formData.append('user_id', inputUser.userEmail);
      console.log('유저 이미지 교체 중');
      const response = await axios.post(
        'process.env.SERVER_URL:9999/api/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      fetchUserProfileImage(inputUser.userEmail);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <button className="ImageUpload" onClick={handleFileClick}>
        이미지 변경
      </button>
    </div>
  );
};

export default ImageUpload;
