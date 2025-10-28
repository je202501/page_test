import React, { useState, useEffect, useRef } from "react";
import { messageTelegram } from "./service/telegramService";
import { jwtDecode } from "jwt-decode";

//현재온도 보여주기+에러메시지 발송
const RefTempAndMessage = ({
  refrigerator_number,
  refrigerator_id,
  setting_temp_value,
  onTemperatureChange,
}) => {
  const [temperatureData, setTemperatureData] = useState(null);
  const alertSentRef = useRef(false); // useRef 사용

  //현재 온도의 상태 평가(설정온도보다 7도 높으면 danger) + 메시지 발송
  const evaluateTemperatureStatus = (currentTemp) => {
    const threshold = Number(setting_temp_value) + 7;
    const isDanger = currentTemp >= threshold;

    //현재 온도의 상태가 danger이면 텔레그램 메시지 발송
    if (isDanger && !alertSentRef.current) {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const adminId = decoded.admin_id;
      messageTelegram(adminId, token, refrigerator_number);
      alertSentRef.current = true;
    } else if (!isDanger && alertSentRef.current) {
      alertSentRef.current = false;
    }

    return isDanger ? "danger" : "normal";
  };

  //가장 최근 온도 가져오기
  const fetchTemperatureData = async () => {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 60 * 60 * 1000);
      const endTime = now;

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}:${
          import.meta.env.VITE_SERVER_PORT
        }/api/temperature/?refrigerator_id=${refrigerator_id}&start_date=${startTime.toISOString()}&end_date=${endTime.toISOString()}`
      );
      const data = await response.json();

      //데이터가 있으면 변수에 저장, 온도의 상태 평가
      if (data.data?.length > 0) {
        const currentTemp = Number(data.data[0].temperature_value);
        setTemperatureData(data.data[0]);
        onTemperatureChange(evaluateTemperatureStatus(currentTemp));
      } else {
        setTemperatureData(null);
        onTemperatureChange("normal");
      }
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      onTemperatureChange("normal");
    }
  };

  //30초마다 새로고침
  useEffect(() => {
    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 30000);
    return () => clearInterval(interval);
  }, [refrigerator_id, setting_temp_value]);

  return (
    <div>
      {temperatureData ? (
        <p>
          현재 온도:{" "}
          {temperatureData.temperature_value != null
            ? Number(temperatureData.temperature_value).toFixed(1)
            : "error"}
          °C
        </p>
      ) : (
        <p>온도 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default RefTempAndMessage;
