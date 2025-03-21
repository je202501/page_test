import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RefCreate = ({ onClose }) => {
  const [newref, setNewref] = useState([]);

  const handleChange = (e) => {
    setNewref({
      ...newref,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ''),
    });
  };

  const handleSave = async () => {
    try {
      newref.append('admin_id', admin_id);
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/`,
        newref
      );
      alert('생성이 완료되었습니다.');
      window.location.reload(); // 데이터 새로고침
    } catch (error) {
      console.error('수정 실패:', error);
      alert('생성에 실패했습니다.');
    }
  };

  return (
    <div
      className="modalref"
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
      <span>냉장고 No : </span>
      <input
        type="text"
        name="refrigerator_id"
        value={newref.refrigerator_id}
        onChange={handleChange}
        required
      />
      <br />

      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default RefCreate;
