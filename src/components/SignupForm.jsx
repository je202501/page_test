import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';

const SignupForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:9999/api/admin', form);
      alert('✅ 회원가입 성공');
      navigate('/'); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('❌ 회원가입 실패. 다시 시도하세요.');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <input
        type="text"
        name="username"
        placeholder="사용자 이름"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">가입하기</button>
    </form>
  );
};

export default SignupForm;
