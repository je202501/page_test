import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import SignupForm from "../components/SignupForm";
import "./BistechMainPage.css"; // BistechMainPage와 동일한 스타일시트 사용

const SignupPage = ({ setAuth }) => {
  return (
    <div className="admin-container">
      <AdminNavbar setAuth={setAuth} currentPage="signup" />

      <main className="admin-content">
        <div className="signup-card">
          <SignupForm />
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
