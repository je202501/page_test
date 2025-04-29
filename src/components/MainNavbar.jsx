import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainNavbar = ({ setAuth, onTelegramClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  const goToMain = () => navigate("/main");

  return (
    <div className="action-bar">
      <h1
        className="page-title"
        onClick={goToMain}
        style={{ cursor: "pointer" }}
      >
        냉장고 관리 시스템
      </h1>
      <div className="button-group">
        <button className="btn btn-telegram" onClick={onTelegramClick}>
          <i className="fab fa-telegram"></i> 텔레그램 설정
        </button>
        <button className="btn btn-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> 로그아웃
        </button>
      </div>
    </div>
  );
};

export default MainNavbar;
