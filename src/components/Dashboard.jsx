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

const TemperatureDashboard = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // 현재 시간과 24시간 전 시간을 계산하여 날짜 입력 필드 초기화
  useEffect(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // datetime-local 입력 형식에 맞게 변환 (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date) => {
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    setEndDate(formatDateForInput(now));
    setStartDate(formatDateForInput(twentyFourHoursAgo));

    // 초기 데이터 로드
    fetchTemperature(
      formatDateForInput(twentyFourHoursAgo),
      formatDateForInput(now)
    );
  }, []);

  const fetchTemperature = async (start = startDate, end = endDate) => {
    // 입력값 검증
    if (!start || !end) {
      setError('시작 날짜와 종료 날짜를 모두 입력해주세요.');
      return;
    }

    const startTime = new Date(start);
    const endTime = new Date(end);

    // 날짜 차이 계산 (밀리초 단위)
    const diffInMs = endTime - startTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // 24시간 초과 검사
    if (diffInHours > 24) {
      setError('조회 기간은 최대 24시간까지 가능합니다.');
      return;
    }

    // 시작 날짜가 종료 날짜보다 늦은 경우 검사
    if (startTime > endTime) {
      setError('시작 날짜는 종료 날짜보다 빨라야 합니다.');
      return;
    }

    setError(''); // 에러 메시지 초기화

    try {
      const formattedStartDate = startTime.toISOString();
      const formattedEndDate = endTime.toISOString();

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/temperature/`,
        {
          params: {
            refrigerator_id: 2,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          },
        }
      );

      if (!response.data?.data?.length) {
        setError('해당 기간에 데이터가 없습니다.');
        setData([]); // 데이터 초기화
        return;
      }

      // 데이터 정렬 (오래된 순서에서 최신 순서로)
      const sortedData = [...response.data.data].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const formattedData = sortedData.map((entry) => ({
        time: new Date(entry.createdAt).toLocaleString(),
        temperature: parseFloat(entry.temperature_value),
        fridgeId: entry.refrigerator_id,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('온도 데이터를 가져오는 중 오류 발생:', error);
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleFetch = () => {
    fetchTemperature();
  };

  return (
    <div style={{ width: '80%', height: 400, margin: 'auto' }}>
      <h2>일간 온도 그래프</h2>
      <div>
        <label>시작 날짜: </label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label> 종료 날짜: </label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleFetch}>조회</button>
      </div>

      {/* 에러 메시지 표시 */}
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

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
