import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Detail = () => {
  let [person, setPerson] = useState([]);
  let [residents, setResidents] = useState([]);
  const location = useLocation();
  const refrigerator_id = location.state?.refrigerator_id || null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchPerson();
      } catch (err) {
        console.log('실패함');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (person.length > 0 && refrigerator_id !== undefined) {
      fetchResidents();
    }
  }, [person]);

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
        setPerson(formattedData);
      });
  };

  const fetchResidents = async () => {
    const response = await axios
      .get(`${import.meta.env.VITE_SERVER_URL}:9999/api/resident`)
      .then((res) => {
        console.log(`상주:${res.data.data}`);
        const filteredData = res.data.data.filter(
          (item) => item.refrigerator_id === parseInt(refrigerator_id, 10)
        );
        setResidents(filteredData);
      });
  };

  // 현재 냉장고 정보 찾기
  const currentPerson = person.find(
    (item) => item.refrigerator_id === parseInt(refrigerator_id, 10)
  );

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!currentPerson) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <div>
      <h1
        onClick={() => {
          navigate('/main');
        }}
      >
        🏠
      </h1>
      <div className="personBox">
        <p>관리번호: {currentPerson.management_number}</p>
        <p>냉장고: {currentPerson.refrigerator_number}</p>
        <h3>고인명: {currentPerson.person_name}</h3>
        <h3>생년월일: {currentPerson.person_birthday}</h3>
        <p>입관일: {currentPerson.entry_date}</p>
        <p>출관일: {currentPerson.exit_date}</p>
        {residents.map((resident, j) => (
          <p key={j}>
            상주 {j + 1}: {resident.resident_name} {resident.phone_number}
          </p>
        ))}
        <p>설정온도: 제상:</p>
      </div>
    </div>
  );
};

export default Detail;
