import React, { useState } from 'react';
import axios from 'axios';
import DropdownSelectorAdmin from './DropdownSelectorAdmin'; // 경로는 실제 위치에 맞게 조정하세요
import TypeSelector from './TypeSelector';

const RefCreate = ({ onClose }) => {
  const [newref, setNewref] = useState({
    refrigerator_number: '',
    setting_temp_value: 0,
    admin_id: null,
  });
  const [selectedType, setSelectedType] = useState("")
  const [error, setError] = useState('');

  const validateRefrigeratorNumber = (value) => {
    const regex = /^[1-9]-([1]|[2])$/;
    return regex.test(value);
  };

  const formatRefrigeratorNumber = (value) => {
    if (validateRefrigeratorNumber(value)) {
      return `NO.${value}`;
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'refrigerator_number') {
      if (!validateRefrigeratorNumber(value)) {
        setError("냉장고 번호는 '1-1' ~ '9-2' 형식이어야 합니다.");
      } else {
        setError('');
      }
    }
    setNewref({
      ...newref,
      [name]: value.replace(/\s*/g, ''),
    });
  };

  const handleAdminSelect = (adminId) => {
    setNewref((prev) => ({ ...prev, admin_id: adminId }));
  };
/**
 * 냉장고 타입 결정 핸들러
 */
  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleCreate = async () => {
    if (error) {
      alert(error);
      return;
    }
    if (!newref.admin_id) {
      alert('업체를 선택해주세요.');
      return;
    }
    try {
      const modifiedRef = {
        ...newref,
        refrigerator_number: formatRefrigeratorNumber(
          newref.refrigerator_number
        ),
        refrigerator_type: selectedType,
      };
      console.log(modifiedRef);
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/`,
        modifiedRef,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('생성이 완료되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('생성 실패:', error);
      alert(
        `생성에 실패했습니다. 오류 메시지: ${error.response?.data?.message || error.message
        }`
      );
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
      <h4 style={{ marginLeft: '10px' }}>냉장고 생성</h4>

      <DropdownSelectorAdmin onSelectAdmin={handleAdminSelect} />

      <br />
      <span>냉장고 No : </span>
      <input
        type="text"
        name="refrigerator_number"
        value={newref.refrigerator_number}
        onChange={handleChange}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      
      <TypeSelector onSelectType={handleTypeSelect} />

      <button onClick={handleCreate}>생성</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default RefCreate;
