import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import DashboardWeek from "../components/DashboardWeek";
import "./BistechMainPage.css";

const BistechWeekPage = ({ setAuth }) => {
  return (
    <div className="admin-container">
      <AdminNavbar setAuth={setAuth} currentPage="week" />

      <main className="admin-content">
        <h1>주당 평균 온도 및 전류 조회 대시보드</h1>
        <DashboardWeek />
      </main>
    </div>
  );
};

export default BistechWeekPage;
