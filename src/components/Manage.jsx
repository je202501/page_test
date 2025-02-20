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
          management_number: item.management_number,
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
          (item) => item.primary_resident == 1
        );
        setPrimaryResidents(filteredData);
      });
  };

  return (
    <div>
      {person.map(function (a, i) {
        return (
          <div className="personBox" key={i}>
            <p>냉장고: {person[i].refrigerator_number}</p>
            <h2>고인명: {person[i].person_name}</h2>
            <h3>생년월일: {person[i].person_birthday}</h3>
            <p>입관일: {person[i].entry_date}</p>
            <p>출관일: {person[i].exit_date}</p>
            <p>관리번호: {person[i].management_number}</p>
            {primaryResidents.map((x, j) => {
              return (
                <div key={j}>
                  {primaryResidents[j].refrigerator_id ==
                  person[i].refrigerator_id ? (
                    <p>대표상주: {primaryResidents[j].resident_name}</p>
                  ) : null}
                </div>
              );
            })}
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
