import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DropdownSelector from "./DropdownSelector";

// 모든 날짜를 전월로 표시하는 포맷팅 함수
const formatAsPreviousMonth = (date) => {
  if (!date) return "";

  const prevMonth = new Date(date);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return `${prevMonth.getMonth() + 1}월`;
};

// 날짜 입력 필드 형식 (YYYY-MM-DDTHH:MM)
const formatDateForInput = (date) => {
  if (!(date instanceof Date)) return "";
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// 커스텀 툴팁 (모든 날짜를 전월로 표시)
const CustomTooltip = ({ active, payload, dateRange }) => {
  if (!active || !payload || !payload.length) return null;

  const formatForDisplay = (date) => {
    if (!date) return "";
    const prevMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return `${prevMonth.getFullYear()}.${prevMonth.getMonth() + 1}`;
  };

  return (
    <div
      style={{
        background: "white",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <p style={{ fontWeight: "bold" }}>
        {` ${formatForDisplay(dateRange.end)}`}
      </p>
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color }}>
          {`${item.name}: ${item.value}`}
        </p>
      ))}
    </div>
  );
};

const DashboardWeek = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // 초기 날짜 설정 (일주일 전 ~ 현재)
  useEffect(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    setStartDate(formatDateForInput(oneWeekAgo));
    setEndDate(formatDateForInput(now));
  }, []);

  // 날짜 유효성 검사 (최대 60일 차이)
  const validateDates = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (isNaN(startTime.getTime())) {
      setError("시작 날짜가 유효하지 않습니다.");
      return false;
    }

    if (isNaN(endTime.getTime())) {
      setError("종료 날짜가 유효하지 않습니다.");
      return false;
    }

    if (startTime >= endTime) {
      setError("종료 날짜는 시작 날짜보다 뒤여야 합니다.");
      return false;
    }

    const diffInDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
    if (diffInDays > 60) {
      setError("최대 60일까지 조회 가능합니다.");
      return false;
    }

    setError("");
    return true;
  };

  // 데이터 조회 함수
  const fetchData = async () => {
    if (!selectedRefrigeratorId) {
      setError("냉장고를 선택해주세요.");
      return;
    }

    if (!validateDates(startDate, endDate)) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/yeartemp/month`,
        {
          params: {
            refrigerator_id: selectedRefrigeratorId,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
          },
        }
      );

      const sortedData =
        response.data?.data?.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ) || [];

      const formattedData = sortedData.map((entry) => ({
        time: new Date(entry.createdAt),
        temperature: parseFloat(entry.month_temp_value) || 0,
        outTemperature: parseFloat(entry.out_month_temp_value) || 0,
        settingTemp: parseFloat(entry.setting_month_temp_value) || 0,
        current: parseFloat(entry.month_current_value) || 0,
      }));

      setData(formattedData);
      setDateRange({
        start: new Date(startDate),
        end: new Date(endDate),
      });
    } catch (error) {
      setError(`데이터 조회 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 조회 버튼 핸들러
  const handleFetch = () => {
    fetchData();
  };

  return (
    <div style={{ width: "80%", height: 400, margin: "auto" }}>
      <div style={{ marginBottom: "20px" }}>
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
          {isLoading ? "로딩 중..." : "조회"}
        </button>
      </div>

      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(date) => {
                const d = new Date(date);
                const prevMonth = new Date(d);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                return `${prevMonth.getMonth() + 1}월`;
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: "전류 (A)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "온도 (℃)", angle: 90, position: "insideRight" }}
            />
            <Tooltip content={<CustomTooltip dateRange={dateRange} />} />
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
        <div style={{ textAlign: "center", padding: "50px" }}>
          {!error && "데이터가 없습니다. 날짜와 냉장고를 선택해주세요."}
        </div>
      )}
    </div>
  );
};

export default DashboardWeek;
