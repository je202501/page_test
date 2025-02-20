import React from 'react';
import { useNavigate } from 'react-router-dom';

const BistechMainPage = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ 토큰 삭제
    setAuth(false); // ✅ 상태 즉시 반영
    navigate('/'); // ✅ 로그인 페이지로 이동
  };

  return (
    <div className="main-page">
      <h1>🔹 Bistech 관리자 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default BistechMainPage;
