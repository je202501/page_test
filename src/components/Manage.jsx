import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import data from './data.js';
import './Manage.css';

const Manage = () => {
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [primaryResidents, setPrimaryResidents] = useState([]);

  useEffect(() => {
    try {
      fetchPerson(), fetchResidents();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerson = async () => {
    const response = await axios
      .get(`${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator`)
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
        }));

        // refrigerator_number 기준으로 정렬
        formattedData.sort((a, b) => {
          // "NO.1-1" → "1-1"로 변환
          const aNumber = a.refrigerator_number.replace('NO.', ''); // "NO.1-1" → "1-1"
          const bNumber = b.refrigerator_number.replace('NO.', ''); // "NO.2-1" → "2-1"

          // 메인 번호와 서브 번호로 분리
          const [aMain, aSub] = aNumber.split('-').map(Number); // "1-1" → [1, 1]
          const [bMain, bSub] = bNumber.split('-').map(Number); // "2-1" → [2, 1]

          // 메인 번호로 정렬
          if (aMain !== bMain) return aMain - bMain;
          // 서브 번호로 정렬
          return aSub - bSub;
        });

        setPerson(formattedData);
        console.log('정렬된 데이터:', formattedData);
      });
  };

  const fetchResidents = async () => {
    const response = await axios
      .get('${import.meta.env.VITE_SERVER_URL}:9999/api/resident')
      .then((res) => {
        console.log(`상주:${res.data.data}`);
        const filteredData = res.data.data.filter(
          (item) => item.primary_resident == 1
        );
        setPrimaryResidents(filteredData);
      });
  };

  // 냉장고 번호 그룹화
  const groupedPersons = person.reduce((acc, cur) => {
    const key = cur.refrigerator_number.split('-')[0]; // 냉장고 그룹 (No.1, No.2 등)
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

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
              className="personBox"
              key={i}
              style={{
                width: '380px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <p>냉장고: {personData.refrigerator_number}</p>
              <h2>고인명: {personData.person_name}</h2>
              <h3>생년월일: {personData.person_birthday}</h3>
              <p>입관일: {personData.entry_date}</p>
              <p>출관일: {personData.exit_date}</p>
              <p>관리번호: {personData.management_number}</p>
              {primaryResidents.map((resident, j) => (
                <div key={j}>
                  {resident.refrigerator_id === personData.refrigerator_id && (
                    <p>대표상주: {resident.resident_name}</p>
                  )}
                </div>
              ))}
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
