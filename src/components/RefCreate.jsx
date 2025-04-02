import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const RefCreate = ({ onClose }) => {
  const [newref, setNewref] = useState({
    person_name: '',
    person_birthday: '',
    entry_date: '',
    exit_date: '',
    refrigerator_number: '',
    setting_temp_value: 0,
    admin_id: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }
    const decodedToken = jwtDecode(token);
    setNewref((prev) => ({ ...prev, admin_id: Number(decodedToken.admin_id) }));
  }, []);

  const validateRefrigeratorNumber = (value) => {
    const regex = /^[1-9]-([1]|[2])$/; // 앞 숫자는 1-9, 뒤 숫자는 1 또는 2만 가능
    return regex.test(value);
  };

  const formatRefrigeratorNumber = (value) => {
    if (validateRefrigeratorNumber(value)) {
      return `NO.${value}`; // 자동으로 'NO.' 추가
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

  const handleCreate = async () => {
    if (error) {
      alert(error);
      return;
    }
    try {
      const modifiedRef = {
        ...newref,
        refrigerator_number: formatRefrigeratorNumber(
          newref.refrigerator_number
        ),
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
      window.location.reload(); // 데이터 새로고침
    } catch (error) {
      console.error('생성 실패:', error);
      alert(
        `생성에 실패했습니다. 오류 메시지: ${
          error.response?.data?.message || error.message
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
      <button onClick={handleCreate}>생성</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default RefCreate;
