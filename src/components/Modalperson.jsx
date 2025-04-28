import React, { useState, useEffect } from "react";
import axios from "axios";

//수정 모달
const Modalperson = ({ person, onClose }) => {
  const [updatedPerson, setUpdatedPerson] = useState({
    refrigerator_id: person?.refrigerator_id || "",
    person_name: person?.person_name || "",
    person_birthday: person?.person_birthday || "",
    entry_date: person?.entry_date || "",
    exit_date: person?.exit_date || "",
    refrigerator_number: person?.refrigerator_number || "",
    entry_reservation: person?.entry_reservation || false,
  });
  console.log(updatedPerson.entry_reservation);
  const handleChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ""),
    });
  };

  // 체크박스 변경 핸들러 추가
  const handleCheckboxChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/${
          person.refrigerator_id
        }`,
        updatedPerson
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
      <h4 style={{ marginLeft: "10px" }}>수정</h4>

      <span>고인명 : </span>
      <input
        type="text"
        name="person_name"
        value={updatedPerson.person_name}
        onChange={handleChange}
      />
      <br />
      <span>생년월일 : </span>
      <input
        type="text"
        name="person_birthday"
        value={updatedPerson.person_birthday}
        onChange={handleChange}
      />
      <br />
      <span>입관일 : </span>
      <input
        type="datetime-local"
        name="entry_date"
        value={updatedPerson.entry_date}
        onChange={handleChange}
      />
      <span style={{ marginLeft: "10px" }}>입관예약 : </span>
      <input
        type="checkbox"
        name="entry_reservation"
        checked={updatedPerson.entry_reservation}
        onChange={handleCheckboxChange}
      />
      <br />
      <span>출관일 : </span>
      <input
        type="datetime-local"
        name="exit_date"
        value={updatedPerson.exit_date}
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default Modalperson;
