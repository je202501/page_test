import React, { useState, useEffect } from 'react';
import axios from 'axios';

//수정 모달
const ModalRef = ({ person, onClose }) => {
  const [updatedRef, setUpdatedRef] = useState({
    setting_temp_value: person?.setting_temp_value || '',
  });

  const handleChange = (e) => {
    setUpdatedRef({
      ...updatedRef,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ''),
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/${
          person.refrigerator_id
        }`,
        updatedRef
      );
      alert('수정이 완료되었습니다.');
      window.location.reload(); // 데이터 새로고침
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div
      className="Modalperson"
      style={{
        display: 'block',
        position: 'relative',
        border: '1px solid',
        background: 'lightblue',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h4 style={{ marginLeft: '10px' }}>수정</h4>
      <span>설정온도 : </span>
      <input
        type="text"
        name="setting_temp_value"
        value={updatedRef.setting_temp_value}
        onChange={handleChange}
      />

      <br />

      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default ModalRef;
