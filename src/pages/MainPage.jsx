import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Manage from "../components/Manage";

import TelegramWaitingModal from "../components/modal/TelegramWaitingModal";

const MainPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 사용
  const [telegramModal, setTelegramModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  return (
    <div className="main-page">
      <h1>🏠</h1>

      <button onClick={handleLogout}>로그아웃</button>

      <button onClick={() => setTelegramModal(true)}>텔레그램 설정</button>

      <br />
      <Manage />

      <div>
        <TelegramWaitingModal
          open={telegramModal}
          onClose={() => setTelegramModal(false)}
        />
      </div>
    </div>
  );
};

export default MainPage;
