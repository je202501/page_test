import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemperatureGraph from '../components/TemperatureGraph';

const BistechChartPage = ({ setAuth }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // ✅ 토큰 삭제
        setAuth(false); // ✅ 상태 즉시 반영
        navigate('/'); // ✅ 로그인 페이지로 이동
    };

    const handleChart = () => {
        navigate('/bistechmain')
    }

    return (
        <div className="main-page">
            <h1>🔹 Bistech 관리자 페이지</h1>
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={handleChart}>날짜별 온도보기</button>
            <TemperatureGraph></TemperatureGraph>
        </div>
    );
};

export default BistechChartPage;
