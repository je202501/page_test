import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Manage from '../components/Manage';
import RefCreate from '../components/RefCreate';
import TelegramWaitingModal from '../components/modal/TelegramWaitingModal';

const MainPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [telegramModal, setTelegramModal] = useState(false);
  const [modalCreateRef, setModalCreateRef] = useState(false);

  const handleModalCreateRefClose = () => {
    setModalCreateRef((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제

    setAuth(false);
    navigate('/'); // 로그인 페이지로 이동
  };

  return (
    <div className="main-page">
      <h1>🏠</h1>

      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => setModalCreateRef((prev) => !prev)}>
        냉장고 생성
      </button>
      <button onClick={() => setTelegramModal(true)}>텔레그램 설정</button>
      {modalCreateRef && <RefCreate onClose={handleModalCreateRefClose} />}
      <br />
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
