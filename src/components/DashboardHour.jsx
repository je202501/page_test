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

// 시간당 평균 그래프 조회
const DashboardHour = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);

  // 날짜 형식 변환 함수
  const formatDateForInput = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to formatDateForInput');
      return '';
    }
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // 날짜 유효성 검사
  const validateDates = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      setError('유효하지 않은 날짜 형식입니다.');
      return false;
    }

    const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
    if (diffInHours > 24) {
      setError('조회 기간은 최대 24시간까지 가능합니다.');
      return false;
    }

    if (startTime > endTime) {
      setError('시작 날짜는 종료 날짜보다 빨라야 합니다.');
      return false;
    }

    return true;
  };

  // 초기 날짜 설정
  useEffect(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    setEndDate(formatDateForInput(now));
    setStartDate(formatDateForInput(twentyFourHoursAgo));
  }, []);

  // 시작 날짜 변경 시 종료 날짜 자동 설정(24시간 후)
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) return;

      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      setEndDate(formatDateForInput(end));
    }
  }, [startDate]);

  // 선택된 냉장고 또는 날짜 변경 시 데이터 가져오기
  useEffect(() => {
    if (selectedRefrigeratorId && startDate && endDate) {
      fetchTemperature(startDate, endDate, selectedRefrigeratorId);
    }
  }, [selectedRefrigeratorId, startDate, endDate]);

  // 시작 날짜와 종료 날짜 사이의 데이터 가져오기
  const fetchTemperature = async (start, end, refrigeratorId) => {
    if (!start || !end) {
      setError('시작 날짜와 종료 날짜를 모두 입력해주세요.');
      return;
    }

    if (!refrigeratorId) {
      setError('냉장고를 선택해주세요.');
      return;
    }

    if (!validateDates(start, end)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const formattedStartDate = startTime.toISOString();
      const formattedEndDate = endTime.toISOString();

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/yeartemp/day`,
        {
          params: {
            refrigerator_id: refrigeratorId,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          },
        }
      );

      console.log('API Response:', response.data); // 응답 데이터 로깅

      if (!response.data?.data?.length) {
        setError('해당 기간에 데이터가 없습니다.');
        setData([]);
        return;
      }

      const sortedData = [...response.data.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      const formattedData = sortedData.map((entry) => {
        // 데이터 필드가 없는 경우 기본값 설정
        const time = entry.createdAt
          ? new Date(entry.createdAt).toLocaleString()
          : '';
        const temperature = parseFloat(entry.day_temp_value) || 0;
        const outTemperature = parseFloat(entry.out_day_temp_value) || 0;
        const settingTemp = parseFloat(entry.setting_day_temp_value) || 0;
        const current = parseFloat(entry.day_current_value) || 0;

        return {
          time,
          temperature,
          outTemperature,
          settingTemp,
          current,
          fridgeId: entry.refrigerator_id,
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error('온도 데이터를 가져오는 중 오류 발생:', error);
      setError(`데이터를 가져오는 중 오류가 발생했습니다: ${error.message}`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetch = () => {
    fetchTemperature(startDate, endDate, selectedRefrigeratorId);
  };

  return (
    <div style={{ width: '80%', height: 400, margin: 'auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <DropdownSelector onSelectRefrigerator={setSelectedRefrigeratorId} />
        <label>시작 날짜: </label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
        />
        <label> 종료 날짜: </label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={handleFetch} disabled={isLoading}>
          {isLoading ? '로딩 중...' : '조회'}
        </button>
      </div>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          데이터를 불러오는 중입니다...
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" hide />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: '전류 (A)', angle: -90, position: 'insideLeft' }}
            />
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
      ) : (
        !error && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            표시할 데이터가 없습니다
          </div>
        )
      )}
    </div>
  );
};

export default DashboardHour;
