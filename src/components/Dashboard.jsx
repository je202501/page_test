import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MAX_DATA_POINTS = 50; // 최대 저장할 데이터 개수

const TemperatureDashboard = () => {
  const [data, setData] = useState([]);

  // 날짜 포맷 변환 함수
  const formatTime = (timeString) => {
    const year = timeString.slice(0, 4);
    const month = timeString.slice(4, 6);
    const day = timeString.slice(6, 8);
    const hour = timeString.slice(8, 10);
    const minute = timeString.slice(10, 12);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }:9999/api/temperature/?refrigerator_id=2`
        ); // 백엔드 API 호출
        console.log('API Response:', response.data);
        if (
          !response.data ||
          !response.data.data ||
          response.data.data.length === 0
        ) {
          console.error('Invalid API response:', response.data);
          return;
        }

        const latestEntry = response.data.data[response.data.data.length - 1];
        const newData = {
          time: new Date(latestEntry.createdAt).toLocaleString(), // 시간 변환
          temperature: parseFloat(latestEntry.temperature_value), // 숫자로 변환
          fridgeId: latestEntry.refrigerator_id, // 냉장고 ID
        };

        setData((prevData) => {
          const updatedData = [...prevData, newData];
          return updatedData.slice(-MAX_DATA_POINTS); // 최대 50개 데이터 유지
        });
      } catch (error) {
        console.error('온도 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    const interval = setInterval(fetchTemperature, 5000); // 5초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '80%', height: 400, margin: 'auto' }}>
      <h2>실시간 온도 그래프</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureDashboard;
