import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import data from './data.js';
import './Manage.css';

const Manage = () => {
  let [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div>
      {person.map(function (a, i) {
        return (
          <div className="personBox">
            <p>냉장고 No: {person[i].refrigerator_id}</p>
            <h2>고인명: {person[i].person_name}</h2>
            <h3>생년월일: {person[i].person_birthday}</h3>
            <p>입관일: {person[i].entry_date}</p>
            <p>출관일: {person[i].exit_date}</p>
            <button
              onClick={() => {
                navigate(`/setting/${i}`);
              }}
            >
              설정
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Manage;
