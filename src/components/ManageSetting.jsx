import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import data from './data.js';

const ManageSetting = () => {
  let [person, setPerson] = useState(data);
  const { index } = useParams();
  const i = parseInt(index, 10);
  let [modal, setModal] = useState(false);
  console.log('location.state:', location.state);

  if (i === undefined || person[i] === undefined) {
    return <p>데이터를 불러올 수 없습니다.</p>;
  }
  return (
    <div>
      <div className="personBox">
        <p>관리번호: {person[i].id}</p>
        <p>냉장고 No: {person[i].ref}</p>
        <h3>
          고인명: {person[i].name} 생년월일: {person[i].birth}
        </h3>
        <p>입관일: {person[i].entry}</p>
        <p>출관일: {person[i].exit}</p>
        <p>대표 상주: {person[i].chiefMourner}</p>
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
      <span>관리번호 : </span>
      <input
        type="text"
        name="id"
        placeholder={person[i].id}
        onChange={(e) => {
          setInputText(e.target.value);
          console.log(inputText);
        }}
      />
      <br />
      <span>냉장고 No : </span>
      <input type="text" name="ref" placeholder={person[i].ref} />
      <br />
      <span>고인명 : </span>
      <input type="text" name="name" placeholder={person[i].name} />
      <br />
      <span>생년월일 : </span>
      <input type="text" name="birth" placeholder={person[i].birth} />
      <br />

      <button>저장</button>
      <button>취소</button>
    </div>
  );
};

export default ManageSetting;
