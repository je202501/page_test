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
import DropdownSelector from './DropdownSelector';

const TemperatureDashboard = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null); // 추가

  useEffect(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const formatDateForInput = (date) => {
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    setEndDate(formatDateForInput(now));
    setStartDate(formatDateForInput(twentyFourHoursAgo));

    fetchTemperature(
      formatDateForInput(twentyFourHoursAgo),
      formatDateForInput(now),
      selectedRefrigeratorId // 냉장고 ID 반영
    );
  }, [selectedRefrigeratorId]); // 냉장고 ID 변경될 때마다 실행

  const fetchTemperature = async (
    start = startDate,
    end = endDate,
    refrigeratorId = selectedRefrigeratorId
  ) => {
    if (!start || !end) {
      setError('시작 날짜와 종료 날짜를 모두 입력해주세요.');
      return;
    }

    if (!refrigeratorId) {
      setError('냉장고를 선택해주세요.');
      return;
    }

    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInHours = (endTime - startTime) / (1000 * 60 * 60);

    if (diffInHours > 24) {
      setError('조회 기간은 최대 24시간까지 가능합니다.');
      return;
    }

    if (startTime > endTime) {
      setError('시작 날짜는 종료 날짜보다 빨라야 합니다.');
      return;
    }

    setError('');

    try {
      const formattedStartDate = startTime.toISOString();
      const formattedEndDate = endTime.toISOString();

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/temperature/`,
        {
          params: {
            refrigerator_id: refrigeratorId, // 선택한 냉장고 ID 반영
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          },
        }
      );

      if (!response.data?.data?.length) {
        setError('해당 기간에 데이터가 없습니다.');
        setData([]);
        return;
      }

      const sortedData = [...response.data.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

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
        <DropdownSelector onSelectRefrigerator={setSelectedRefrigeratorId} />
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

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureDashboard;
