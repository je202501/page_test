import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Image from "./Image.jsx";
import RefrigeratorTemperature from "./RefrigeratorTemperature.jsx";
import "./Detail.css";
import ExitDateChecker from "./ExitDateChecker.jsx";

//상세정보(모니터 GUI)
const Detail = () => {
  const [person, setPerson] = useState([]);
  const [primaryResidents, setPrimaryResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refrigerator_id } = useParams(); // ← URL에서 refrigerator_id 추출
  const navigate = useNavigate();

  const [temperatureStatus, setTemperatureStatus] = useState("normal"); // 추가: 온도 상태

  // 배경색 결정 함수
  const getBackgroundColor = () => {
    return temperatureStatus === "danger" ? "bg-red-200" : "bg-white";
  };

  //냉장고 정보 가져오기기
  const fetchPerson = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator`
      );
      const formattedData = res.data.data.map((item) => ({
        refrigerator_id: item.refrigerator_id,
        refrigerator_number: item.refrigerator_number,
        person_name: item.person_name,
        person_birthday: item.person_birthday,
        entry_date: item.entry_date,
        exit_date: item.exit_date,
        management_number: item.management_number,
        setting_temp_value: item.setting_temp_value,
        check_defrost: item.check_defrost,
      }));
      setPerson(formattedData);
    } catch (err) {
      console.error("사람 정보 불러오기 실패", err);
    }
  };
  //대표 상주 정보 가져오기기
  const fetchResidents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/resident`
      );
      const filteredData = res.data.data.filter(
        (item) => item.primary_resident === 1
      );
      setPrimaryResidents(filteredData);
    } catch (err) {
      console.error("상주 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPerson();
      await fetchResidents();
      setLoading(false);
    };

    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  //현재 냉장고 id
  const currentPerson = person.find(
    (item) => item.refrigerator_id === parseInt(refrigerator_id, 10)
  );

  if (loading) {
    return <p>인증 확인 중입니다...</p>;
  }

  if (!currentPerson) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <div
      className={`fullscreen-container ${temperatureStatus === "danger" ? "danger-bg" : ""
        }`}
    >
      <div className="content-grid">
        {/* 왼쪽 정보 영역 */}
        <div className="info-section">
          <div className="refrigerator-info">
            <h1 className="refrigerator-number">
              안치냉장고 {currentPerson.refrigerator_number}
            </h1>
          </div>

          <div className="deceased-info">
            <h2 className="deceased-name">
              고인명 : {currentPerson.person_name}
            </h2>
            <p className="deceased-birth">
              생년월일: {currentPerson.person_birthday}
            </p>
          </div>

          <div className="timeline-info">
            <p className="entry-date">입관일 : {currentPerson.entry_date}</p>
            <p className="exit-date">출관일 : {currentPerson.exit_date}</p>
            <ExitDateChecker
              refrigerator_number={currentPerson.refrigerator_number}
              exit_date={currentPerson.exit_date}
            ></ExitDateChecker>
          </div>

          <div className="resident-info">
            {primaryResidents.map(
              (resident, j) =>
                resident.refrigerator_id === currentPerson.refrigerator_id && (
                  <p key={j} className="primary-resident">
                    대표 상주 : {resident.resident_name} {resident.phone_number}
                  </p>
                )
            )}
          </div>

          <div className="management-info">
            <p className="management-number">
              관리번호 : {currentPerson.management_number}
            </p>
            <p className="temperature-setting">
              설정온도 : {currentPerson.setting_temp_value}°C
            </p>
            <RefrigeratorTemperature
              refrigerator_number={currentPerson.refrigerator_number}
              refrigerator_id={currentPerson.refrigerator_id}
              setting_temp_value={currentPerson.setting_temp_value}
              onTemperatureChange={setTemperatureStatus}
              className="temperature-text"
            />
            <p>
              상태:
              <span
                style={{
                  color: currentPerson.check_defrost ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {currentPerson.check_defrost ? " 제상중" : " 냉장중"}
              </span>
            </p>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div className="image-section">
          <div className="image-wrapper">
            <Image refrigerator_id={refrigerator_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;