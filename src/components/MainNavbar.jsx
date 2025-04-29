import React from "react";
import { useNavigate } from "react-router-dom";

const MainNavbar = ({ setAuth, currentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  const goToMain = () => navigate("/main");
  const goToSettings = () => navigate("/settings");

  return (
    <nav className="action-bar">
      <h1 className="page-title">냉장고 관리 시스템</h1>
      <div className="button-group">
        <button
          className={`btn ${
            currentPage === "main" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={goToMain}
        >
          <i className="fas fa-home"></i> 메인
        </button>
        <button
          className={`btn ${
            currentPage === "settings" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={goToSettings}
        >
          <i className="fas fa-cog"></i> 설정
        </button>
        <button className="btn btn-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> 로그아웃
        </button>
      </div>
    </nav>
  );
};

export default MainNavbar;
