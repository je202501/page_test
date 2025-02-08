import React from 'react';
import SignupForm from '../components/SignupForm';
import './PageStyles.css'; // 추가된 스타일 파일

const SignupPage = () => {
  return (
    <div className="form-wrapper">
      {' '}
      {/* 중앙 정렬을 위한 컨테이너 */}
      <SignupForm />
    </div>
  );
};

export default SignupPage;
