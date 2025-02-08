import React from 'react';
import LoginForm from '../components/LoginForm';
import './PageStyles.css'; // 추가된 스타일 파일

const LoginPage = () => {
  return (
    <div className="form-wrapper">
      {' '}
      {/* 중앙 정렬을 위한 컨테이너 */}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
