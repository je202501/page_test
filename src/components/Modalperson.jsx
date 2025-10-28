import React, { useState } from "react";
import axios from "axios";

//고인 정보 수정
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

  const handleChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ""),
    });
  };

  const handleCheckboxChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}:${
          import.meta.env.VITE_SERVER_PORT
        }/api/refrigerator/${person.refrigerator_id}`,
        {
          ...updatedPerson,
          entry_date: updatedPerson.entry_date.replace("T", " "),
        }
      );
      alert("수정이 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">고인 정보 수정</h2>

        <div className="modal-form">
          <div className="form-group">
            <label>고인명</label>
            <input
              type="text"
              name="person_name"
              value={updatedPerson.person_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>생년월일</label>
            <input
              type="text"
              name="person_birthday"
              value={updatedPerson.person_birthday}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>입관일</label>
            <input
              type="datetime-local"
              name="entry_date"
              value={updatedPerson.entry_date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="entry_reservation"
                checked={updatedPerson.entry_reservation}
                onChange={handleCheckboxChange}
              />
              <span>입관 예약</span>
            </label>
          </div>

          <div className="form-group">
            <label>출관일</label>
            <input
              type="datetime-local"
              name="exit_date"
              value={updatedPerson.exit_date}
              onChange={handleChange}
              className="form-input"
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

export default Modalperson;
