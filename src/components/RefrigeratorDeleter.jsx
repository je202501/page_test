import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import DropdownSelector from './DropdownSelector';

const RefrigeratorDeleter = ({ onClose }) => {
  const [refrigerators, setRefrigerators] = useState([]);
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);

  const handleDelete = () => {
    if (!selectedRefrigeratorId) {
      alert('냉장고를 선택하세요.');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(
      `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/${Number(
        selectedRefrigeratorId
      )}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          alert('냉장고가 삭제되었습니다.');
          setRefrigerators((prev) =>
            prev.filter(
              (fridge) =>
                fridge.refrigerator_id !== Number(selectedRefrigeratorId)
            )
          );
          setSelectedRefrigeratorId(null);
        } else {
          alert('삭제에 실패했습니다.');
        }
      })
      .catch((err) => {
        console.error('삭제 에러:', err);
        alert('삭제 중 오류가 발생했습니다.');
      });
  };

  return (
    <div
      style={{
        display: 'block',
        position: 'relative',
        border: '1px solid',
        background: 'lightblue',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h4 style={{ marginLeft: '10px' }}>냉장고 삭제</h4>
      <label>삭제할 냉장고 : </label>
      <DropdownSelector
        onSelectRefrigerator={setSelectedRefrigeratorId}
      ></DropdownSelector>
      <br />
      <button onClick={handleDelete} disabled={!selectedRefrigeratorId}>
        삭제
      </button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default RefrigeratorDeleter;
