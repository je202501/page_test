import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import data from './data.js';

const ManageSetting = () => {
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const { index } = useParams();
  const i = parseInt(index, 10);
  let [modal, setModal] = useState(false);

  console.log('location.state:', location.state);

  useEffect(() => {
    fetchPerson();
  }, []);

  const fetchPerson = async () => {
    try {
      const response = await axios
        .get('http://localhost:9999/api/refrigerator')
        .then((res) => {
          console.log(`데이터:${res.data}`);
          const formattedData = res.data.data.map((item) => ({
            refrigerator_id: item.refrigerator_id,
            person_name: item.person_name,
            person_birthday: item.person_birthday,
            entry_date: item.entry_date,
            exit_date: item.exit_date,
          }));
          setPerson(formattedData);
        })

        .catch((res) => {
          console.log('실패함', res.data.error);
        });
    } finally {
      setLoading(false);
    }
  };

  if (i === undefined || person[i] === undefined) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }
  return (
    <div>
      <div className="personBox">
        <p>냉장고 No: {person[i].refrigerator_id}</p>
        <h3>고인명: {person[i].person_name}</h3>
        <h3>생년월일: {person[i].person_birthday}</h3>
        <p>입관일: {person[i].entry_date}</p>
        <p>출관일: {person[i].exit_date}</p>

        <p>설정온도: 제상:</p>

        <button
          onClick={() => {
            setModal(modal == false ? true : false);
          }}
        >
          수정
        </button>
        <button>QR 밴드 출력</button>
        <button>출관 확인</button>
        <br />
        {modal == true ? <Modal i={i} person={person} /> : null}
      </div>
    </div>
  );
};

const Modal = (props) => {
  let [inputText, setInputText] = useState('');
  const i = props.i;
  let [person, setPerson] = useState(props.person);
  return (
    <div
      className="modal"
      style={{ borderBlock: '1px solid', background: 'lightblue' }}
    >
      <h4 style={{ marginLeft: '10px' }}>수정</h4>
      <span>냉장고 No : </span>
      <input
        type="text"
        name="ref"
        placeholder={person[i].refrigerator_id}
        onChange={(e) => {
          setInputText(e.target.value);
          console.log(inputText);
        }}
      />
      <br />
      <span>고인명 : </span>
      <input
        type="text"
        name="name"
        placeholder={person[i].person_name}
        onChange={(e) => {
          setInputText(e.target.value);
          console.log(inputText);
        }}
      />
      <br />
      <span>생년월일 : </span>
      <input
        type="text"
        name="birth"
        placeholder={person[i].person_birthday}
        onChange={(e) => {
          setInputText(e.target.value);
          console.log(inputText);
        }}
      />
      <br />

      <button>저장</button>
      <button>취소</button>
    </div>
  );
};

export default ManageSetting;
