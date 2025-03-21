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
          }:9999/api/image/?refrigerator_id=${refrigerator_id}`
        );
        console.log(response, ',<<<<<<');

        const imageUrl = response.data.data; // 서버에서 받은 이미지 URL
        console.log(imageUrl);
        if (!imageUrl) {
          console.error('이미지 URL을 찾을 수 없습니다.');
          return;
        }

        setImageSrc(encodeURI(imageUrl));
      } catch (error) {
        console.error('이미지 가져오기 실패:', error);
      }
    };

    fetchImage();
  }, [refrigerator_id]);

  return (
    <div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="냉장고 이미지"
          style={{ width: '300px', height: 'auto' }}
        />
      ) : (
        <p>이미지를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Image;
