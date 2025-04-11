import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Manage from '../components/Manage';
import RefCreate from '../components/RefCreate';
import TelegramWaitingModal from '../components/modal/TelegramWaitingModal';
import RefrigeratorDeleter from '../components/RefrigeratorDeleter';

const MainPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 사용
  const [telegramModal, setTelegramModal] = useState(false);
  const [modalCreateRef, setModalCreateRef] = useState(false);
  const [modalDeleteRef, setModalDeleteRef] = useState(false);

  const handleModalCreateRefClose = () => {
    setModalCreateRef((prev) => !prev);
  };
  const handleModalDeleteRefClose = () => {
    setModalDeleteRef((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/');
  };

  return (
    <div className="main-page">
      <h1>🏠</h1>

      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => setModalCreateRef((prev) => !prev)}>
        냉장고 생성
      </button>
      <button onClick={() => setModalDeleteRef((prev) => !prev)}>
        냉장고 삭제
      </button>
      <button onClick={() => setTelegramModal(true)}>텔레그램 설정</button>

      {modalCreateRef && <RefCreate onClose={handleModalCreateRefClose} />}
      {modalDeleteRef && (
        <RefrigeratorDeleter onClose={handleModalDeleteRefClose} />
      )}

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
