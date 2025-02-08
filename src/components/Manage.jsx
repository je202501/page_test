import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import data from './data.js';
import './Manage.css';

const Manage = () => {
  let [person, setPerson] = useState(data);
  const navigate = useNavigate();
  return (
    <div>
      {person.map(function (a, i) {
        return (
          <div class="personBox">
            <p>냉장고 No: {person[i].ref}</p>
            <h2>고인명: {person[i].name}</h2>
            <h3>생년월일: {person[i].birth}</h3>
            <p>입관일: {person[i].entry}</p>
            <p>출관일: {person[i].exit}</p>
            <p>대표 상주: {person[i].chiefMourner}</p>
            <p>관리번호: {person[i].id}</p>
            <button>설정</button>
          </div>
        );
      })}
    </div>
  );
};

export default Manage;
