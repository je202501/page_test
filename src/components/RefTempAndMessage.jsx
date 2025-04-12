import React, { useState, useEffect, useRef } from 'react';
import { messageTelegram } from './service/telegramService';
import { jwtDecode } from 'jwt-decode';

const RefTempAndMessage = ({
  refrigerator_number,
  refrigerator_id,
  setting_temp_value,
  onTemperatureChange,
}) => {
  const [temperatureData, setTemperatureData] = useState(null);
  const alertSentRef = useRef(false); // useRef 사용

  const evaluateTemperatureStatus = (currentTemp) => {
    const threshold = Number(setting_temp_value) + 7;
    const isDanger = currentTemp >= threshold;

    if (isDanger && !alertSentRef.current) {
      console.log('<<<<<여기로 옴 <<<<<');
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.admin_id;
      console.log('admin_name:', decoded.admin_name);
      console.log('냉장고번호', refrigerator_number);
      messageTelegram(adminId, token, refrigerator_number);
      alertSentRef.current = true;
    } else if (!isDanger && alertSentRef.current) {
      alertSentRef.current = false;
    }

    return isDanger ? 'danger' : 'normal';
  };

  const fetchTemperatureData = async () => {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 60 * 60 * 1000);
      const endTime = now;

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }:9999/api/temperature/?refrigerator_id=${refrigerator_id}&start_date=${startTime.toISOString()}&end_date=${endTime.toISOString()}`
      );
      const data = await response.json();

      if (data.data?.length > 0) {
        const currentTemp = Number(data.data[0].temperature_value);
        setTemperatureData(data.data[0]);
        onTemperatureChange(evaluateTemperatureStatus(currentTemp));
      } else {
        setTemperatureData(null);
        onTemperatureChange('normal');
      }
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
      onTemperatureChange('normal');
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 30000);
    return () => clearInterval(interval);
  }, [refrigerator_id, setting_temp_value]);

  return (
    <div>
      {temperatureData ? (
        <p>현재 온도: {Number(temperatureData.temperature_value)}°C</p>
      ) : (
        <p>온도 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default RefTempAndMessage;
