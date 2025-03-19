import { useState, useEffect } from 'react';
import axios from 'axios';

const Image = ({ refrigerator_id }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }:9999/api/image/?refrigerator_id=${refrigerator_id}`,
          { responseType: 'blob' } // 바이너리 데이터 받기
        );

        const imageUrl = URL.createObjectURL(response.data.data); // Blob -> URL 변환
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('이미지 가져오기 실패:', error);
      }
    };

    fetchImage();
  }, [refrigerator_id]); // refrigerator_id가 변경될 때마다 실행

  return (
    <div>
      <h2>이미지 출력</h2>
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
