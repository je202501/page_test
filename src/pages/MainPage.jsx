import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Manage from "../components/Manage";
import TelegramWaitingModal from "../components/modal/TelegramWaitingModal";
import "./MainPage.css"; // 새로 생성할 CSS 파일

const MainPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [telegramModal, setTelegramModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  return (
    <div className="main-page">
      <div className="main-container">
        {/* 상단 액션 바 */}
        <div className="action-bar">
          <h1 className="page-title">냉장고 관리 시스템</h1>
          <div className="button-group">
            <button
              className="btn btn-telegram"
              onClick={() => setTelegramModal(true)}
            >
              <i className="fab fa-telegram"></i> 텔레그램 설정
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> 로그아웃
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <main className="content-area">
          <Manage />
        </main>

        {/* 텔레그램 설정 모달 */}
        <TelegramWaitingModal
          open={telegramModal}
          onClose={() => setTelegramModal(false)}
        />
      </div>
    </div>
  );
};

export default MainPage;
