import { useState, useEffect } from 'react';
import axios from 'axios';

const Image = ({ refrigerator_id }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }:9999/api/image/?refrigerator_id=${refrigerator_id}`,
          {
            responseType: 'blob',
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(encodeURI(imageUrl));
      } catch (error) {
        console.error('이미지 가져오기 실패:', error);
      }
    };

    fetchImage(); // 처음 실행

    const interval = setInterval(() => {
      fetchImage(); // 10초마다 새로고침
    }, 10000);

    return () => clearInterval(interval); // cleanup
  }, [refrigerator_id]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="냉장고 이미지"
          style={{
            maxWidth: '100%',
            width: '400px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      ) : (
        <p>이미지를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Image;
