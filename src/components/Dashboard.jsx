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

//일간조회그래프
const TemperatureDashboard = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);

  // 날짜 형식 변환 함수
  const formatDateForInput = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // 초기 날짜 설정
  useEffect(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    setEndDate(formatDateForInput(now));
    setStartDate(formatDateForInput(twentyFourHoursAgo));

    fetchTemperature(
      formatDateForInput(twentyFourHoursAgo),
      formatDateForInput(now),
      selectedRefrigeratorId
    );
  }, [selectedRefrigeratorId]);

  // 시작 날짜 변경 시 종료 날짜 자동 설정(24시간 후)
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      setEndDate(formatDateForInput(end));
    }
  }, [startDate]);

  //시작 날짜와 종료 날짜 사이의 데이터 가져오기
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
        `${import.meta.env.VITE_SERVER_URL}:57166/api/temperature/`,
        {
          params: {
            refrigerator_id: refrigeratorId,
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
        outTemperature: parseFloat(entry.out_temperature_value),
        settingTemp: parseFloat(entry.setting_temp_value),
        current: parseFloat(entry.current_value), // 전류 값
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
          {/* 왼쪽 Y축 (온도) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{ value: '전류 (A)', angle: -90, position: 'insideLeft' }}
          />
          {/* 오른쪽 Y축 (전류) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: '온도 (℃)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            name="내부 온도"
            dot={{ r: 2 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="outTemperature"
            stroke="#82ca9d"
            name="외부 온도"
            dot={{ r: 2 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="settingTemp"
            stroke="#413ea0"
            name="설정 온도"
            dot={{ r: 2 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="current"
            stroke="#ff7300"
            name="전류 값"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureDashboard;
