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
            responseType: 'blob', // 리스폰 타입을 블롭으로 받을 수 있게 설정
          }
        );

        const imageUrl = URL.createObjectURL(response.data); // URL로 오는 이미지를 인식할 수 있게 블롭 데이터를 URL로 바꾸는 코드
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
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="냉장고 이미지"
          style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
        />
      ) : (
        <p>이미지를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Image;
