import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import data from './data.js';
import './Manage.css';
import RefTempAndMessage from './RefTempAndMessage.jsx';

const Manage = () => {
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [primaryResidents, setPrimaryResidents] = useState([]);
  const [temperatureStatus, setTemperatureStatus] = useState({}); // { refrigerator_id: 'normal' | 'danger' }
  const token = localStorage.getItem('token');
  const admin_id = jwtDecode(token).admin_id;

  useEffect(() => {
    try {
      fetchPerson();
      fetchResidents();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerson = async () => {
    const response = await axios
      .get(
        `${
          import.meta.env.VITE_SERVER_URL
        }:9999/api/refrigerator/?admin_id=${admin_id}`
      )
      .then((res) => {
        console.log(`데이터:${res.data}`);
        const formattedData = res.data.data.map((item) => ({
          refrigerator_id: item.refrigerator_id,
          refrigerator_number: item.refrigerator_number,
          person_name: item.person_name,
          person_birthday: item.person_birthday,
          entry_date: item.entry_date,
          exit_date: item.exit_date,
          management_number: item.management_number,
          setting_temp_value: item.setting_temp_value, // 추가: 설정 온도
        }));

        formattedData.sort((a, b) => {
          const aNumber = a.refrigerator_number.replace('NO.', '');
          const bNumber = b.refrigerator_number.replace('NO.', '');
          const [aMain, aSub] = aNumber.split('-').map(Number);
          const [bMain, bSub] = bNumber.split('-').map(Number);
          if (aMain !== bMain) return aMain - bMain;
          return aSub - bSub;
        });

        setPerson(formattedData);
        console.log('정렬된 데이터:', formattedData);
      });
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

  // 온도 상태 업데이트 함수
  const handleTemperatureChange = (refrigerator_id, status) => {
    setTemperatureStatus((prev) => ({
      ...prev,
      [refrigerator_id]: status,
    }));
  };

  // 냉장고 번호 그룹화
  const groupedPersons = person.reduce((acc, cur) => {
    const key = cur.refrigerator_number.split('-')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  // 배경색 결정 함수
  const getBackgroundColor = (refrigerator_id) => {
    return temperatureStatus[refrigerator_id] === 'danger'
      ? 'bg-red-200'
      : 'bg-white';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      {Object.keys(groupedPersons).map((groupKey, index) => (
        <div
          key={index}
          style={{
            paddingLeft: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '400px',
          }}
        >
          {groupedPersons[groupKey].map((personData, i) => (
            <div
              className={`personBox ${getBackgroundColor(
                personData.refrigerator_id
              )}`}
              key={i}
              style={{
                width: '380px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor:
                  temperatureStatus[personData.refrigerator_id] === 'danger'
                    ? '#fee2e2'
                    : 'white', // 직접 스타일 적용
              }}
            >
              <p>냉장고: {personData.refrigerator_number}</p>
              <h2>고인명: {personData.person_name}</h2>
              <h3>생년월일: {personData.person_birthday}</h3>
              <p>입관일: {personData.entry_date}</p>
              <p>출관일: {personData.exit_date}</p>
              <p>관리번호: {personData.management_number}</p>
              <p>설정 온도: {personData.setting_temp_value}°C</p>
              {primaryResidents.map((resident, j) => (
                <div key={j}>
                  {resident.refrigerator_id === personData.refrigerator_id && (
                    <p>대표상주: {resident.resident_name}</p>
                  )}
                </div>
              ))}
              <RefTempAndMessage
                refrigerator_number={personData.refrigerator_number}
                refrigerator_id={personData.refrigerator_id}
                setting_temp_value={personData.setting_temp_value}
                onTemperatureChange={(status) =>
                  handleTemperatureChange(personData.refrigerator_id, status)
                }
              />
              <button
                onClick={() =>
                  navigate(`/setting/${personData.refrigerator_id}`, {
                    state: { refrigerator_id: personData.refrigerator_id },
                  })
                }
              >
                설정
              </button>
              <button
                onClick={() =>
                  navigate(`/detail/${personData.refrigerator_id}`, {
                    state: { refrigerator_id: personData.refrigerator_id },
                  })
                }
              >
                상세정보
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Manage;
