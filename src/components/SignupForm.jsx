import React, { useState } from 'react';
import axios from 'axios';

//업체 ID 생성
const SignupForm = ({ onClose }) => {
  const [form, setForm] = useState({
    admin_name: '',
    admin_account: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //업체 ID 생성
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}:57166/api/admin`,
        form
      );
      alert('✅ 업체 ID 생성 성공');
      onClose();
    } catch (error) {
      console.error(error);
      alert('❌ 업체 ID 생성 실패. 다시 시도하세요.');
    }
  };

  return (
    <div className="modal-form-container">
      <h2 className="modal-title">업체 ID 생성</h2>

      <form onSubmit={handleSubmit} className="signup-modal-form">
        <div className="form-group">
          <label>업체명</label>
          <input
            type="text"
            name="admin_name"
            placeholder="업체명을 입력하세요"
            value={form.admin_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="admin_account"
            placeholder="아이디를 입력하세요"
            value={form.admin_account}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="modal-button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button type="submit" className="submit-btn">
            생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
