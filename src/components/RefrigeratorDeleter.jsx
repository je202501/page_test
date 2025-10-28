import React, { useState } from 'react';
import DropdownSelector from './DropdownSelector';

//냉장고 삭제
const RefrigeratorDeleter = ({ onClose }) => {
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);

  const handleDelete = () => {
    if (!selectedRefrigeratorId) {
      alert('냉장고를 선택하세요.');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(
<<<<<<< HEAD
      `${import.meta.env.VITE_SERVER_URL}:51766/api/refrigerator/${Number(
=======
      `${import.meta.env.VITE_SERVER_URL}:57166/api/refrigerator/${Number(
>>>>>>> feature/seokho
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
          setSelectedRefrigeratorId(null);
          onClose(); // 삭제 성공 시 모달 닫기
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
    <div className="modal-form-container">
      <h2 className="modal-title">냉장고 삭제</h2>

      <div className="delete-form">
        <div className="form-group">
          <label>삭제할 냉장고 선택</label>
          <DropdownSelector
            onSelectRefrigerator={setSelectedRefrigeratorId}
            className="dropdown-selector"
          />
        </div>

        <div className="modal-button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className={`submit-btn ${
              !selectedRefrigeratorId ? 'disabled' : ''
            }`}
            onClick={handleDelete}
            disabled={!selectedRefrigeratorId}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefrigeratorDeleter;
