import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import TemperatureDashboard from '../components/Dashboard';
import DashBoards from '../components/DashBoards';
import './BistechMainPage.css';

const BistechMainPage = ({ setAuth }) => {
  return (
    <div className="admin-container">
      <AdminNavbar setAuth={setAuth} currentPage="main" />

      <main className="admin-content">
        <h1>일간 온도 및 전류 조회 대시보드</h1>
        <DashBoards type="day" />
      </main>
    </div>
  );
};

export default BistechMainPage;
