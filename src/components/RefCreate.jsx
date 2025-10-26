import React, { useState } from 'react';
import axios from 'axios';
import DropdownSelectorAdmin from './DropdownSelectorAdmin';
import TypeSelector from './TypeSelector';

//냉장고 생성
const RefCreate = ({ onClose }) => {
  const [newref, setNewref] = useState({
    refrigerator_number: '',
    setting_temp_value: 0,
    admin_id: null,
  });
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');

  // axios 인스턴스 생성 (토큰 설정)
  const authAxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL + ':51766',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  //냉장고 번호 규칙 확인
  const validateRefrigeratorNumber = (value) => {
    const regex = /^[1-9]-([1]|[2])$/;
    return regex.test(value);
  };

  //NO.접두사 처리리
  const formatRefrigeratorNumber = (value) => {
    if (validateRefrigeratorNumber(value)) {
      return `NO.${value}`;
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'refrigerator_number') {
      //냉장고 번호 규칙 위반 시 에러메시지
      if (!validateRefrigeratorNumber(value)) {
        setError("냉장고 번호는 '1-1' ~ '20-2' 형식이어야 합니다.");
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

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  // 냉장고 중복 확인
  const checkDuplicateRefNumber = async (adminId, refNumber) => {
    try {
      const response = await authAxios.get(`/api/admin/?admin_id=${adminId}`);
      const refrigerators = response.data.data[0]?.Refrigerators || [];
      const formattedRefNumber = formatRefrigeratorNumber(refNumber);

      return refrigerators.some(
        (ref) => ref.refrigerator_number === formattedRefNumber
      );
    } catch (error) {
      console.error('냉장고 목록 조회 실패:', error);
      alert('냉장고 목록을 불러오는 데 실패했습니다.');
      return true; // 에러 발생 시 생성 방지
    }
  };

  // 냉장고 생성
  const handleCreate = async () => {
    if (error) {
      alert(error);
      return;
    }
    if (!newref.admin_id) {
      alert('업체를 선택해주세요.');
      return;
    }
    if (!selectedType) {
      alert('냉장고 타입을 선택해주세요.');
      return;
    }

    try {
      // 중복 확인
      const isDuplicate = await checkDuplicateRefNumber(
        newref.admin_id,
        newref.refrigerator_number
      );

      if (isDuplicate) {
        alert('해당 업체에 이미 동일한 번호의 냉장고가 존재합니다.');
        return;
      }

      const modifiedRef = {
        ...newref,
        refrigerator_number: formatRefrigeratorNumber(
          newref.refrigerator_number
        ),
        refrigerator_type: selectedType,
      };

      await authAxios.post('/api/refrigerator/', modifiedRef);
      alert('생성이 완료되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('생성 실패:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        '생성 중 오류가 발생했습니다.';
      alert(`생성에 실패했습니다. 오류 메시지: ${errorMessage}`);
    }
  };

  return (
    <div className="modal-form-container">
      <h2 className="modal-title">냉장고 생성</h2>

      <div className="refrigerator-form">
        <div className="form-group">
          <label>업체 선택</label>
          <DropdownSelectorAdmin
            onSelectAdmin={handleAdminSelect}
            className="dropdown-selector"
          />
        </div>

        <div className="form-group">
          <label>냉장고 번호</label>
          <br />
          <input
            type="text"
            name="refrigerator_number"
            placeholder="예: 1-1"
            value={newref.refrigerator_number}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="form-group">
          <label>냉장고 타입</label>
          <TypeSelector
            onSelectType={handleTypeSelect}
            className="type-selector"
          />
        </div>

        <div className="modal-button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="submit-btn" onClick={handleCreate}>
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefCreate;
