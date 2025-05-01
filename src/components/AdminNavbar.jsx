import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RefrigeratorDeleter from './RefrigeratorDeleter';
import RefCreate from './RefCreate';
import SignupForm from './SignupForm'; // SignupForm 컴포넌트 추가

//bistech Navbar
const AdminNavbar = ({ setAuth, currentPage }) => {
  const navigate = useNavigate();
  const [modalDeleteRef, setModalDeleteRef] = useState(false);
  const [modalCreateRef, setModalCreateRef] = useState(false);
  const [modalSignup, setModalSignup] = useState(false); // 업체 ID 생성 모달 상태 추가

  // 모달 핸들링 함수들
  const handleModalDeleteRefClose = () => setModalDeleteRef(false);
  const handleModalCreateRefClose = () => setModalCreateRef(false);
  const handleModalSignupClose = () => setModalSignup(false);

  // 네비게이션 함수들
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/');
  };
  const goToMainPage = () => navigate('/bistechmain');
  const goToRealtimeChart = () => navigate('/bistech/chart');
  const goToHourPage = () => navigate('/bistech/hour');

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-brand">Bistech 관리자</div>
        <div className="navbar-menu">
          {/*버튼*/}
          <button className="nav-btn" onClick={() => setModalSignup(true)}>
            <i className="fas fa-user-plus"></i> 업체 ID 생성
          </button>

          <button
            className={`nav-btn ${currentPage === 'main' ? 'active' : ''}`}
            onClick={goToMainPage}
          >
            <i className="fas fa-chart-bar"></i> 일간 차트 조회
          </button>

          <button
            className={`nav-btn ${currentPage === 'hour' ? 'active' : ''}`}
            onClick={goToHourPage}
          >
            <i className="fas fa-chart-bar"></i> 시간 평균 차트 조회
          </button>

          <button
            className={`nav-btn ${currentPage === 'realtime' ? 'active' : ''}`}
            onClick={goToRealtimeChart}
          >
            <i className="fas fa-chart-line"></i> 실시간 차트
          </button>

          <button className="nav-btn" onClick={() => setModalCreateRef(true)}>
            <i className="fas fa-plus"></i> 냉장고 생성
          </button>

          <button className="nav-btn" onClick={() => setModalDeleteRef(true)}>
            <i className="fas fa-trash"></i> 냉장고 삭제
          </button>

          <button className="nav-btn logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> 로그아웃
          </button>
        </div>
      </nav>

      {/* 냉장고 생성 모달 */}
      {modalCreateRef && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RefCreate onClose={handleModalCreateRefClose} />
          </div>
        </div>
      )}

      {/* 냉장고 삭제 모달 */}
      {modalDeleteRef && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RefrigeratorDeleter onClose={handleModalDeleteRefClose} />
          </div>
        </div>
      )}

      {/* 업체 ID 생성 모달 */}
      {modalSignup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SignupForm onClose={handleModalSignupClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
