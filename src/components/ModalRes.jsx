import React, { useState, useEffect } from "react";
import axios from "axios";

//상주 정보 수정, 삭제
const ModalRes = ({ person, residents: initialResidents, onClose }) => {
  const [residents, setResidents] = useState(
    Array.from({ length: 9 }, (_, index) => ({
      resident_id: null,
      refrigerator_id: person?.refrigerator_id || "",
      resident_name: "",
      phone_number: "",
      primary_resident: index === 0,
      deleteChecked: false,
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
              [key]: key === "primary_resident" ? value === "true" : value,
            }
          : resident
      )
    );
  };
  //수정 또는 삭제한 상주 정보 put
  const handleSave = async () => {
    try {
      //삭제
      const deletePromises = residents
        .filter((resident) => resident.deleteChecked && resident.resident_id)
        .map((resident) =>
          axios.delete(
            `${import.meta.env.VITE_SERVER_URL}:51766/api/resident/${
              resident.resident_id
            }`
          )
        );
      //존재하던 상주의 정보를 바꾸면 수정, 존재하지 않던 상주의 정보를 추가하면 생성
      const updatePromises = residents
        .filter((resident) => !resident.deleteChecked)
        .map(async (resident) => {
          if (resident.resident_id) {
            return axios.put(
              `${import.meta.env.VITE_SERVER_URL}:51766/api/resident/${
                resident.resident_id
              }`,
              resident
            );
          } else if (resident.resident_name) {
            return axios.post(
              `${import.meta.env.VITE_SERVER_URL}:51766/api/resident`,
              resident
            );
          }
          return null;
        });

      await Promise.all([...deletePromises, ...updatePromises]);
      alert("상주 정보가 저장되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <h2 className="modal-title">상주 정보 관리</h2>

        <div className="residents-form">
          {residents.map((resident, index) => (
            <div key={index} className="resident-form-group">
              <div className="resident-header">
                <h4>상주 {index + 1}</h4>
                {index === 0 ? (
                  <span className="primary-badge">대표 상주</span>
                ) : (
                  <label className="delete-checkbox">
                    <input
                      type="checkbox"
                      checked={resident.deleteChecked}
                      onChange={(e) =>
                        handleResidentChange(
                          index,
                          "deleteChecked",
                          e.target.checked
                        )
                      }
                    />
                    <span>삭제</span>
                  </label>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>이름</label>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={resident.resident_name}
                    onChange={(e) =>
                      handleResidentChange(
                        index,
                        "resident_name",
                        e.target.value
                      )
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>전화번호</label>
                  <input
                    type="text"
                    placeholder="전화번호를 입력하세요"
                    value={resident.phone_number}
                    onChange={(e) =>
                      handleResidentChange(
                        index,
                        "phone_number",
                        e.target.value
                      )
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}

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

export default ModalRes;
