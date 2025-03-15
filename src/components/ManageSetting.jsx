import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import data from './data.js';
import ModalRes from './ModalRes.jsx';
import QRcode from './qrcode/QRcode';
import ImageUpload from './ImageUpload.jsx';

const ManageSetting = () => {
  const [QRModal, setQRModal] = useState(false);
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const refrigerator_id = location.state?.refrigerator_id || null;
  let [modalref, setModalref] = useState(false);
  let [modalres, setModalres] = useState(false);
  let [residents, setResidents] = useState([]);
  const navigate = useNavigate();
  console.log(refrigerator_id);
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
    if (person.length > 0 && refrigerator_id !== undefined) {
      fetchResidents();
    }
  }, [person]);

  useEffect(() => {
    console.log('Modal 상태:', modalref);
  }, [modalref]);

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

  // 출관 확인 및 삭제 함수
  const handleExitConfirm = async () => {
    const isConfirmed = window.confirm(
      '출관 확인을 하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );
    if (isConfirmed) {
      try {
        const data = {
          person_name: '',
          person_birthday: '',
          entry_date: '',
          exit_date: '',
        };
        await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }:9999/api/refrigerator/${refrigerator_id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        {
          residents.map((a) => {
            axios.delete(
              `${import.meta.env.VITE_SERVER_URL}:9999/api/resident/${
                a.resident_id
              }`
            );
          });
        }
        alert('출관 처리되었습니다.');
        // 삭제 후 화면 업데이트
        const updatedPerson = person.filter(
          (item) => item.refrigerator_id !== parseInt(refrigerator_id, 10)
        );
        setPerson(updatedPerson);
        navigate('/main'); // 관리 페이지로 이동
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('출관 처리에 실패했습니다.');
      }
    }
  };

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

        <button
          onClick={() => {
            console.log('클릭');
            setModalref((prev) => !prev);
          }}
        >
          고인 수정
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
        {<ImageUpload refrigerator_id={refrigerator_id}></ImageUpload>}
        <button onClick={handleExitConfirm}>출관 확인</button>
        <br />
        {modalref && (
          <Modalref person={currentPerson} onClose={handleModalrefClose} />
        )}
        {modalres && (
          <ModalRes
            person={currentPerson}
            residents={residents}
            onClose={handleModalresClose}
          />
        )}
        {
          <QRcode
            open={QRModal}
            value={currentPerson}
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
const Modalref = ({ person, onClose }) => {
  const [updatedPerson, setUpdatedPerson] = useState({
    refrigerator_id: person?.refrigerator_id || '',
    person_name: person?.person_name || '',
    person_birthday: person?.person_birthday || '',
    entry_date: person?.entry_date || '',
    exit_date: person?.exit_date || '',
  });

  const handleChange = (e) => {
    setUpdatedPerson({
      ...updatedPerson,
      [e.target.name]: e.target.value.replace(/(\s*)/g, ''),
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/${
          person.refrigerator_id
        }`,
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
