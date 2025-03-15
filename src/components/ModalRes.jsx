import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalRes = ({ person, residents: initialResidents, onClose }) => {
  const [residents, setResidents] = useState(
    Array.from({ length: 9 }, (_, index) => ({
      resident_id: null,
      refrigerator_id: person?.refrigerator_id || '',
      resident_name: '',
      phone_number: '',
      primary_resident: index === 0, // 첫 번째 Resident만 기본 상주
      deleteChecked: false, // 삭제 여부 체크박스
    }))
  );

  useEffect(() => {
    if (initialResidents.length > 0) {
      setResidents((prevResidents) =>
        prevResidents.map((resident, index) => {
          if (initialResidents[index]) {
            return { ...initialResidents[index], deleteChecked: false };
          }
          return resident;
        })
      );
    }
  }, [initialResidents]);

  const handleResidentChange = (index, key, value) => {
    setResidents((prevResidents) =>
      prevResidents.map((resident, i) =>
        i === index
          ? {
              ...resident,
              [key]: key === 'primary_resident' ? value === 'true' : value,
            }
          : resident
      )
    );
  };

  const handleSave = async () => {
    try {
      // 삭제할 Resident 목록 필터링
      const deletePromises = residents
        .filter((resident) => resident.deleteChecked && resident.resident_id)
        .map((resident) =>
          axios.delete(
            `process.env.SERVER_URL:9999/api/resident/${resident.resident_id}`
          )
        );

      // 업데이트 또는 생성할 Resident 목록 필터링
      const updatePromises = residents
        .filter((resident) => !resident.deleteChecked) // 삭제되지 않은 것만 업데이트
        .map(async (resident) => {
          if (resident.resident_id) {
            return axios.put(
              `process.env.SERVER_URL:9999/api/resident/${resident.resident_id}`,
              resident
            );
          } else if (resident.resident_name) {
            return axios.post(
              'process.env.SERVER_URL:9999/api/resident',
              resident
            );
          }
          return null;
        });

      // 삭제 및 업데이트 병렬 실행
      await Promise.all([...deletePromises, ...updatePromises]);

      alert('Resident 정보가 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div
      className="modal"
      style={{
        display: 'block',
        position: 'relative',
        border: '1px solid',
        background: 'lightblue',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h4>상주 수정</h4>
      {residents.map((resident, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label>상주 {index + 1} :</label>
          <input
            type="text"
            placeholder="이름"
            value={resident.resident_name}
            onChange={(e) =>
              handleResidentChange(index, 'resident_name', e.target.value)
            }
          />
          <br />
          <span>번호 : </span>
          <input
            type="text"
            placeholder="전화번호"
            value={resident.phone_number}
            onChange={(e) =>
              handleResidentChange(index, 'phone_number', e.target.value)
            }
          />
          {index === 0 ? (
            <span> (대표 상주) </span>
          ) : (
            <label style={{ marginLeft: '10px' }}>
              <input
                type="checkbox"
                checked={resident.deleteChecked}
                onChange={(e) =>
                  handleResidentChange(index, 'deleteChecked', e.target.checked)
                }
              />
              삭제
            </label>
          )}
        </div>
      ))}
      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default ModalRes;
