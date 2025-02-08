import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/main" /> : <LoginPage />}
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
};

export default App;
