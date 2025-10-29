import React, { useState } from 'react';
import axios from 'axios';
import DropdownSelectorAdmin from './DropdownSelectorAdmin';

//Bistech 계정 수정
const BistechEdit = ({ onClose }) => {
  const [form, setForm] = useState({
    // manager_name: "",
    manager_account: '',
    password: '',
    newpassword: '',
    // email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem('token');

  //Bistech 계정 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error('No token found');
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}:${
          import.meta.env.VITE_SERVER_PORT
        }/api/manager/1`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ⚠️ 서버 응답이 성공이지만 message나 data로 실패 여부를 판단해야 하는 경우
      if (res.data.message === 'sever error') {
        alert('❌ ' + res.data.data); // 예: 비밀번호가 일치하지 않습니다.
        return;
      }
      alert('✅ Bistech 계정 수정 성공');
      onClose();
    } catch (error) {
      console.error(error);
      alert('❌ Bistech 계정 수정 실패. 다시 시도하세요.');
    }
  };

  return (
    <div className="modal-form-container">
      <h2 className="modal-title">Bistech 계정 수정</h2>

      <form onSubmit={handleSubmit} className="signup-modal-form">
        {/* <div className="form-group">
          <label>관리자</label>
          <input
            type="text"
            name="manager_name"
            placeholder="관리자를 입력하세요"
            value={form.manager_name}
            onChange={handleChange}
            required
          />
        </div> */}

        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="manager_account"
            placeholder="아이디를 입력하세요"
            value={form.manager_account}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="현재 비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>새로운 비밀번호</label>
          <input
            type="password"
            name="newpassword"
            placeholder="새로운 비밀번호를 입력하세요"
            value={form.newpassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div> */}

        <div className="modal-button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button type="submit" className="submit-btn">
            수정
          </button>
        </div>
      </form>
    </div>
  );
};

export default BistechEdit;
