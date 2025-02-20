import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './FormStyles.css';

const LoginForm = ({ setAuth, loginType }) => {
  const [credentials, setCredentials] = useState({
    admin_account: '',
    password: '',
  });
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
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('서버 응답:', response.data);
      if (
        response.data.status === 200 &&
        response.data.message === 'success' &&
        response.data.data
      ) {
        const token = response.data.data;
        const decodedToken = jwtDecode(token); // 토큰 디코딩

        console.log('디코딩된 토큰:', decodedToken);

        if (loginType === 'Bistech' && decodedToken.type !== 'MANAGER') {
          alert('❌ 접근 불가: 관리자 권한이 필요합니다.');
          return;
        }

        // ✅ 로그인 성공 후 상태 업데이트
        localStorage.setItem('token', token);
        setAuth(true);

        // ✅ Bistech 로그인 시 /bistechmain으로 이동, 일반 로그인은 /main으로 이동
        if (loginType === 'Bistech') {
          navigate('/bistechmain');
        } else {
          navigate('/main');
        }
      } else {
        alert('❌ 로그인 실패. 이메일과 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      alert('❌ 로그인 실패. 서버 오류 또는 네트워크 문제');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{loginType === 'Bistech' ? 'Bistech 로그인' : '관리자 로그인'}</h2>
      <input
        type="text"
        name="admin_account"
        placeholder="아이디"
        value={credentials.admin_account}
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
