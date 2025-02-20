import React from 'react';
import { useNavigate } from 'react-router-dom';
import Manage from '../components/Manage';

const MainPage = ({ setAuth }) => {
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
      <Manage></Manage>
    </div>
  );
};

export default MainPage;
