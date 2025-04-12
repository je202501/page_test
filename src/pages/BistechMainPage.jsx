import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemperatureDashboard from '../components/Dashboard';
import RefrigeratorDeleter from '../components/RefrigeratorDeleter';
import RefCreate from '../components/RefCreate';

const BistechMainPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [modalDeleteRef, setModalDeleteRef] = useState(false);
  const [modalCreateRef, setModalCreateRef] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ 토큰 삭제
    setAuth(false); // ✅ 상태 즉시 반영
    navigate('/'); // ✅ 로그인 페이지로 이동
  };
  const handleModalDeleteRefClose = () => {
    setModalDeleteRef((prev) => !prev);
  };
  const handleModalCreateRefClose = () => {
    setModalCreateRef((prev) => !prev);
  };

  const goToSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };
  // 실시간 차트 이동 함수
  const handleChartPage = () => {
    navigate('/bistech/chart');
  };

  return (
    <div className="main-page">
      <h1>Bistech 관리자 페이지</h1>
      <button onClick={goToSignup}>업체 ID 생성</button>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => setModalCreateRef((prev) => !prev)}>
        냉장고 생성
      </button>
      <button onClick={() => setModalDeleteRef((prev) => !prev)}>
        냉장고 삭제
      </button>
      {modalCreateRef && <RefCreate onClose={handleModalCreateRefClose} />}
      {modalDeleteRef && (
        <RefrigeratorDeleter onClose={handleModalDeleteRefClose} />
      )}
      <button onClick={handleChartPage}>실시간 차트 보기</button>
      <TemperatureDashboard></TemperatureDashboard>
    </div>
  );
};

export default BistechMainPage;
