import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('로그인 요청 데이터:', credentials); // 디버깅용 로그
    try {
      const response = await axios.post(
        'http://localhost:9999/api/admin/admin_login',
        credentials
      );
      console.log('서버 응답:', response.data);
      localStorage.setItem('token', response.data.token); // 로그인 성공 시 토큰 저장
      alert(`${response.data.username}님, 로그인 성공`);
      navigate('/main'); // 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('❌ 로그인 실패. 이메일과 비밀번호를 확인하세요.');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;
