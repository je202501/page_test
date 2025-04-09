import React, { useState, useEffect } from 'react';
import { messageTelegram } from './service/telegramService';
import { jwtDecode } from 'jwt-decode';

const RefrigeratorTemperature = ({
  refrigerator_id,
  setting_temp_value,
  onTemperatureChange,
}) => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluateTemperatureStatus = (currentTemp) => {
    const threshold = Number(setting_temp_value) + 5;
    /**
     * 비정상적 온도값일 경우 텔레그램 메시지 전송하는 로직
     */
    if (currentTemp >= threshold) {
      const token = localStorage.getItem('token')
      const decoded = jwtDecode(token)
      const adminId = decoded.admin_id
      messageTelegram(adminId, token)
    }
    return currentTemp >= threshold ? 'danger' : 'normal';
  };

  const fetchTemperatureData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 60 * 60 * 1000);
      const endTime = now;

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL
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
    setLoading(false);
  };

  useEffect(() => {
    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 30000);
    return () => clearInterval(interval);
  }, [refrigerator_id, setting_temp_value]);

  return (
    <div>
      {loading && <p>데이터 로딩 중...</p>}
      {temperatureData ? (
        <p>
          현재 온도: {Number(temperatureData.temperature_value)}°C (시간:{' '}
          {new Date(temperatureData.createdAt).toLocaleString()})
        </p>
      ) : (
        <p>온도 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default RefrigeratorTemperature;
