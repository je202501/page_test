import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import DashboardHour from '../components/DashboardHour';
import './BistechMainPage.css';

const BistechHourPage = ({ setAuth }) => {
  return (
    <div className="admin-container">
      <AdminNavbar setAuth={setAuth} currentPage="hour" />

      <main className="admin-content">
        <h1>시간당 평균 온도 및 전류 조회 대시보드</h1>
        <DashboardHour />
      </main>
    </div>
  );
};

export default BistechHourPage;
