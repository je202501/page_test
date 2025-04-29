import React, { useState } from "react";
import axios from "axios";

const ModalRef = ({ person, onClose }) => {
  const [updatedRef, setUpdatedRef] = useState({
    setting_temp_value: person?.setting_temp_value || "",
    defrost_value: person?.defrost_value || "",
    defrost_term: person?.defrost_term || "",
    defrost_time: person?.defrost_time || "",
  });

  const handleChange = (e) => {
    setUpdatedRef({
      ...updatedRef,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ""),
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
      alert("온도 설정이 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("수정 실패:", error);
      alert("온도 설정에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <h2 className="modal-title">냉장/제상 설정</h2>

        <div className="temperature-form">
          <div className="form-group">
            <label>냉장 온도 (°C)</label>
            <input
              type="number"
              name="setting_temp_value"
              value={updatedRef.setting_temp_value}
              onChange={handleChange}
              className="form-input"
              placeholder="예: -20"
            />
          </div>

          <div className="form-group">
            <label>제상 온도 (°C)</label>
            <input
              type="number"
              name="defrost_value"
              value={updatedRef.defrost_value}
              onChange={handleChange}
              className="form-input"
              placeholder="예: 5"
            />
          </div>

          <div className="form-group">
            <label>제상 주기 (시간)</label>
            <input
              type="number"
              name="defrost_term"
              value={updatedRef.defrost_term}
              onChange={handleChange}
              className="form-input"
              placeholder="예: 24"
            />
          </div>

          <div className="form-group">
            <label>제상 시간 (분)</label>
            <input
              type="number"
              name="defrost_time"
              value={updatedRef.defrost_time}
              onChange={handleChange}
              className="form-input"
              placeholder="예: 30"
            />
          </div>

          <div className="modal-button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              닫기
            </button>
            <button type="button" className="submit-btn" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRef;
