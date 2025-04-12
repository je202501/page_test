import React, { useState, useEffect } from 'react';

const RefrigeratorTemperature = ({
  refrigerator_number,
  refrigerator_id,
  setting_temp_value,
  onTemperatureChange,
  className,
}) => {
  const [temperatureData, setTemperatureData] = useState(null);

  const evaluateTemperatureStatus = (currentTemp) => {
    const threshold = Number(setting_temp_value) + 7;
    const isDanger = currentTemp >= threshold;

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
    <div className={`temperature-display ${className || ''}`}>
      {temperatureData ? (
        <p className="current-temperature">
          현재 온도: {Number(temperatureData.temperature_value)}°C
        </p>
      ) : (
        <p>온도 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default RefrigeratorTemperature;
