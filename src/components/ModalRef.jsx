import React, { useState, useEffect } from "react";
import axios from "axios";

//수정 모달
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
      alert("수정이 완료되었습니다.");
      window.location.reload(); // 데이터 새로고침
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div
      className="Modalperson"
      style={{
        display: "block",
        position: "relative",
        border: "1px solid",
        background: "lightblue",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h4 style={{ marginLeft: "10px" }}>냉장 제상 설정</h4>
      <span>냉장온도 : </span>
      <input
        type="text"
        name="setting_temp_value"
        value={updatedRef.setting_temp_value}
        onChange={handleChange}
      />
      <br />

      <span>제상온도 : </span>
      <input
        type="text"
        name="defrost_value"
        value={updatedRef.defrost_value}
        onChange={handleChange}
      />
      <br />
      <span>제상주기(시간) : </span>
      <input
        type="text"
        name="defrost_term"
        value={updatedRef.defrost_term}
        onChange={handleChange}
      />
      <br />
      <span>제상시간(분) : </span>
      <input
        type="text"
        name="defrost_time"
        value={updatedRef.defrost_time}
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default ModalRef;
