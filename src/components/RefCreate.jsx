import React, { useState } from "react";
import axios from "axios";
import DropdownSelectorAdmin from "./DropdownSelectorAdmin";
import TypeSelector from "./TypeSelector";

//냉장고 생성
const RefCreate = ({ onClose }) => {
  const [newref, setNewref] = useState({
    refrigerator_number: "",
    setting_temp_value: 0,
    admin_id: null,
  });
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState("");

  //냉장고 번호 규칙 확인
  const validateRefrigeratorNumber = (value) => {
    const regex = /^[1-9]-([1]|[2])$/;
    return regex.test(value);
  };
  //NO.접두사 처리
  const formatRefrigeratorNumber = (value) => {
    if (validateRefrigeratorNumber(value)) {
      return `NO.${value}`;
    }
    return value;
  };
  //냉장고 번호가 규칙에 맞지않을 시 에러 표시
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "refrigerator_number") {
      if (!validateRefrigeratorNumber(value)) {
        setError("냉장고 번호는 '1-1' ~ '9-2' 형식이어야 합니다.");
      } else {
        setError("");
      }
    }
    setNewref({
      ...newref,
      [name]: value.replace(/\s*/g, ""),
    });
  };

  const handleAdminSelect = (adminId) => {
    setNewref((prev) => ({ ...prev, admin_id: adminId }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  //냉장고 생성
  const handleCreate = async () => {
    if (error) {
      alert(error);
      return;
    }
    if (!newref.admin_id) {
      alert("업체를 선택해주세요.");
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
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/`,
        modifiedRef,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("생성이 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("생성 실패:", error);
      alert(
        `생성에 실패했습니다. 오류 메시지: ${
          error.response?.data?.message || error.message
        }`
      );
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
