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
import BistechChartPage from './pages/BistechChartPage'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    // localStorage 값이 변경될 때마다 상태 업데이트
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth); // 다른 탭에서도 반영되도록
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/main" />
          ) : (
            <LoginPage setAuth={setIsAuthenticated} />
          )
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/main"
        element={
          isAuthenticated ? (
            <MainPage setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/setting/:refrigerator_id"
        element={isAuthenticated ? <SettingPage /> : <Navigate to="/" />}
      ></Route>
      <Route
        path="/detail/:refrigerator_id"
        element={isAuthenticated ? <DetailPage /> : <Navigate to="/" />}
      ></Route>
      <Route path="/bistechmain" element={<BistechMainPage />} />
      <Route path= "/bistech/chart" element={<BistechChartPage/>}/>
    </Routes>
  );
};

export default App;
