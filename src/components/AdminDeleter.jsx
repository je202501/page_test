import React, { useState } from "react";
import axios from "axios";
import DropdownSelectorAdmin from "./DropdownSelectorAdmin";

// 업체 삭제
const AdminDeleter = ({ onClose }) => {
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const token = localStorage.getItem("token");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!selectedAdminId) {
      alert("삭제할 업체를 선택해주세요.");
      return;
    }

    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const confirmDelete = window.confirm(
      "정말로 이 업체를 삭제하시겠습니까? 복구할 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}:${
          import.meta.env.VITE_SERVER_PORT
        }/api/admin/${selectedAdminId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 서버가 삭제 실패 메시지를 보내는 경우 대비
      if (res.data?.message === "server error") {
        alert("❌ " + res.data.data);
        return;
      }

      alert("✅ 업체 삭제 성공");
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ 업체 삭제 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="modal-form-container">
      <h2 className="modal-title">업체 삭제</h2>

      <form onSubmit={handleDelete} className="signup-modal-form">
        <div className="form-group">
          <label>삭제할 업체 선택</label>
          <DropdownSelectorAdmin
            onSelectAdmin={setSelectedAdminId}
            className="dropdown-selector"
          />
        </div>

        <div className="modal-button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button type="submit" className="submit-btn delete-btn">
            삭제
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDeleter;
