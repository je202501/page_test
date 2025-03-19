import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Manage from '../components/Manage';
import TelegramWaitingModal from '../components/modal/TelegramWaitingModal'

const MainPage = ({ setAuth }) => {
  const [telegramModal, setTelegramModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제

    setAuth(false);
    navigate('/'); // 로그인 페이지로 이동
  };

  const goToSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="main-page">
      <h1>🏠</h1>
      <button onClick={goToSignup}>회원가입</button>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => setTelegramModal(true)}>텔레그램 설정</button>
      <Manage></Manage>
      <div>
        <TelegramWaitingModal
          open={telegramModal}
          onClose={() => {
            setTelegramModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;
