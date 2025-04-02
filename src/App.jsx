import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import SettingPage from './pages/SettingPage';
import BistechMainPage from './pages/BistechMainPage';
import DetailPage from './pages/DetailPage';
import { jwtDecode } from 'jwt-decode';
import BistechChartPage from './pages/BistechChartPage'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [userType, setUserType] = useState(null); // 'admin' 또는 'bistech'

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);

      // 토큰이 있으면 사용자 유형 확인
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // 토큰에 따라 사용자 유형 설정 (admin_id가 있으면 일반 관리자)
          setUserType(decoded.admin_id ? 'admin' : 'bistech');
        } catch (error) {
          console.error('토큰 디코딩 오류:', error);
        }
      } else {
        setUserType(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            userType === 'admin' ? (
              <Navigate to="/main" />
            ) : (
              <Navigate to="/bistechmain" />
            )
          ) : (
            <LoginPage setAuth={setIsAuthenticated} setUserType={setUserType} />
          )
        }
      />
      <Route path="/signup" element={<SignupPage />} />

      {/* 일반 관리자 전용 라우트 */}
      <Route
        path="/main"
        element={
          isAuthenticated && userType === 'admin' ? (
            <MainPage setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/setting/:refrigerator_id"
        element={
          isAuthenticated && userType === 'admin' ? (
            <SettingPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/detail/:refrigerator_id"
        element={
          isAuthenticated && userType === 'admin' ? (
            <DetailPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Bistech 관리자 전용 라우트 */}
      <Route
        path="/bistechmain"
        element={
          isAuthenticated && userType === 'bistech' ? (
            <BistechMainPage setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route element={isAuthenticated ? <DetailPage /> : <Navigate to="/" />}
      ></Route>
      <Route path="/bistechmain" element={<BistechMainPage />} />
      <Route path="/bistech/chart" element={<BistechChartPage />} />
    </Routes>
  );
};

export default App;
