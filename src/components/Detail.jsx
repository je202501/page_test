import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Image from './Image.jsx';
import RefrigeratorTemperature from './RefrigeratorTemperature.jsx';

const Detail = () => {
  const [person, setPerson] = useState([]);
  const [primaryResidents, setPrimaryResidents] = useState([]);
  const location = useLocation();
  const refrigerator_id = location.state?.refrigerator_id || null;
  const navigate = useNavigate();

  const [temperatureStatus, setTemperatureStatus] = useState('normal'); // 추가: 온도 상태

  // 배경색 결정 함수
  const getBackgroundColor = () => {
    return temperatureStatus === 'danger' ? 'bg-red-200' : 'bg-white';
  };

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
      }));
      setPerson(formattedData);
    } catch (err) {
      console.error('사람 정보 불러오기 실패', err);
    }
  };

  const fetchResidents = async () => {
    const response = await axios
      .get(`${import.meta.env.VITE_SERVER_URL}:9999/api/resident`)
      .then((res) => {
        console.log(`상주:${res.data.data}`);
        const filteredData = res.data.data.filter(
          (item) => item.primary_resident == 1
        );
        setPrimaryResidents(filteredData);
      });
  };

  // 데이터 초기 로딩 및 10초마다 갱신
  useEffect(() => {
    const loadData = async () => {
      await fetchPerson();
      await fetchResidents();
    };

    loadData(); // 첫 로딩

    const interval = setInterval(() => {
      loadData(); // 10초마다 새로고침
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [refrigerator_id]);

  const currentPerson = person.find(
    (item) => item.refrigerator_id === parseInt(refrigerator_id, 10)
  );

  if (!currentPerson) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {' '}
      {/* 배경색 동적 적용 */}
      <div
        className=" p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: temperatureStatus === 'danger' ? '#fee2e2' : 'white',
        }}
      >
        <div className="flex items-start gap-8">
          {/* 왼쪽 정보 영역 */}
          <div className="flex-1 min-w-0">
            <p>냉장고: {currentPerson.refrigerator_number}</p>
            <h3>고인명: {currentPerson.person_name}</h3>
            <h3>생년월일: {currentPerson.person_birthday}</h3>
            <p>입관일: {currentPerson.entry_date}</p>
            <p>출관일: {currentPerson.exit_date}</p>
            {primaryResidents.map((resident, j) => (
              <div key={j}>
                {resident.refrigerator_id === currentPerson.refrigerator_id && (
                  <p>대표상주: {resident.resident_name}</p>
                )}
              </div>
            ))}
            <p>관리번호: {currentPerson.management_number}</p>
            <p>설정온도: {currentPerson.setting_temp_value}</p>
            <RefrigeratorTemperature
              refrigerator_number={currentPerson.refrigerator_number}
              refrigerator_id={currentPerson.refrigerator_id}
              setting_temp_value={currentPerson.setting_temp_value}
              onTemperatureChange={setTemperatureStatus}
            />
          </div>

          {/* 오른쪽 이미지 영역 */}
          <div
            className="flex-shrink-0"
            style={{ width: '120px', alignSelf: 'flex-start' }}
          >
            <Image refrigerator_id={refrigerator_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
