import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemperatureDashboard from '../components/Dashboard';

const BistechMainPage = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ 토큰 삭제
    setAuth(false); // ✅ 상태 즉시 반영
    navigate('/'); // ✅ 로그인 페이지로 이동
  };

  const goToSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };
  // 실시간 차트 이동 함수
  const handleChartPage = () =>{
    navigate('/bistech/chart')
  }

  return (
    <div className="main-page">
      <h1>Bistech 관리자 페이지</h1>
      <button onClick={goToSignup}>회원가입</button>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={handleChartPage}>실시간 차트 보기</button>
      <TemperatureDashboard></TemperatureDashboard>
    </div>
  );
};

export default BistechMainPage;
