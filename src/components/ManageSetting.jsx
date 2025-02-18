import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import data from './data.js';
import ModalRes from './ModalRes.jsx';
import QRcode from './qrcode/QRcode';

const ManageSetting = () => {
  const [QRModal, setQRModal] = useState(false);
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const { index } = useParams();
  const i = parseInt(index, 10);
  let [modalref, setModalref] = useState(false);
  let [modalres, setModalres] = useState(false);
  let [residents, setResidents] = useState([]);

  const handleModalresClose = () => {
    setModalres(false);
  };
  const handleModalrefClose = () => {
    setModalref(false);
  };

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
    if (person.length > 0 && i !== undefined && person[i] !== undefined) {
      fetchResidents();
    }
  }, [person]);

  useEffect(() => {
    console.log('Modal 상태:', modalref);
  }, [modalref]);

  const fetchPerson = async () => {
    const response = await axios
      .get('http://localhost:9999/api/refrigerator')
      .then((res) => {
        console.log(`데이터:${res.data}`);
        const formattedData = res.data.data.map((item) => ({
          refrigerator_id: item.refrigerator_id,
          refrigerator_number: item.refrigerator_number,
          person_name: item.person_name,
          person_birthday: item.person_birthday,
          entry_date: item.entry_date,
          exit_date: item.exit_date,
        }));
        setPerson(formattedData);
      });
  };

  const fetchResidents = async () => {
    const response = await axios
      .get('http://localhost:9999/api/resident')
      .then((res) => {
        console.log(`상주:${res.data.data}`);
        const filteredData = res.data.data.filter(
          (item) => item.refrigerator_id === person[i].refrigerator_id
        );
        setResidents(filteredData);
      });
  };

  if (i === undefined || person[i] === undefined) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }
  return (
    <div>
      <div className="personBox">
        <p>냉장고: {person[i].refrigerator_number}</p>
        <h3>고인명: {person[i].person_name}</h3>
        <h3>생년월일: {person[i].person_birthday}</h3>
        <p>입관일: {person[i].entry_date}</p>
        <p>출관일: {person[i].exit_date}</p>
        {residents.map((resident, j) => (
          <p key={j}>
            상주 {j + 1}: {resident.resident_name} {resident.phone_number}
          </p>
        ))}
        <p>설정온도: 제상:</p>

        <button
          onClick={() => {
            console.log('클릭');
            setModalref((prev) => !prev);
          }}
        >
          수정
        </button>
        <button
          onClick={() => {
            console.log('클릭');
            setModalres((prev) => !prev);
          }}
        >
          상주 수정
        </button>
        <button
          onClick={() => {
            setQRModal(true);
          }}
        >
          QR 밴드 출력
        </button>
        <button>출관 확인</button>
        <br />
        {modalref && (
          <Modalref i={i} person={person} onClose={handleModalrefClose} />
        )}
        {modalres && (
          <ModalRes
            i={i}
            person={person}
            residents={residents}
            onClose={handleModalresClose}
          />
        )}
        {
          <QRcode
            open={QRModal}
            value={person[i]}
            onClose={() => {
              setQRModal(false);
            }}
          />
        }
      </div>
    </div>
  );
};

//수정 모달
const Modalref = ({ i, person, onClose }) => {
  const [updatedPerson, setUpdatedPerson] = useState({
    refrigerator_id: person[i]?.refrigerator_id || '',
    person_name: person[i]?.person_name || '',
    person_birthday: person[i]?.person_birthday || '',
    entry_date: person[i]?.entry_date || '',
    exit_date: person[i]?.exit_date || '',
  });

  const handleChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:9999/api/refrigerator/${person[i].refrigerator_id}`,
        updatedPerson
      );
      alert('수정이 완료되었습니다.');
      window.location.reload(); // 데이터 새로고침
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div
      className="modalref"
      style={{
        display: 'block',
        position: 'relative',
        border: '1px solid',
        background: 'lightblue',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h4 style={{ marginLeft: '10px' }}>수정</h4>
      <span>냉장고 No : </span>
      <input
        type="text"
        name="refrigerator_id"
        value={updatedPerson.refrigerator_id}
        disabled
      />
      <br />
      <span>고인명 : </span>
      <input
        type="text"
        name="person_name"
        value={updatedPerson.person_name}
        onChange={handleChange}
      />
      <br />
      <span>생년월일 : </span>
      <input
        type="text"
        name="person_birthday"
        value={updatedPerson.person_birthday}
        onChange={handleChange}
      />
      <br />
      <span>입관일 : </span>
      <input
        type="text"
        name="entry_date"
        value={updatedPerson.entry_date}
        onChange={handleChange}
      />
      <br />
      <span>출관일 : </span>
      <input
        type="text"
        name="exit_date"
        value={updatedPerson.exit_date}
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSave}>저장</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default ManageSetting;
