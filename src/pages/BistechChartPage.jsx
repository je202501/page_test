import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import TemperatureGraph from "../components/TemperatureGraph";
import "./BistechMainPage.css";

const BistechChartPage = ({ setAuth }) => {
  return (
    <div className="admin-container">
      <AdminNavbar setAuth={setAuth} currentPage="realtime" />

      <main className="admin-content">
        <TemperatureGraph />
      </main>
    </div>
  );
};

export default BistechChartPage;
