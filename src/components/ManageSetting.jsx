import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ModalRes from "./ModalRes.jsx";
import QRcode from "./qrcode/QRcode";
import ImageUpload from "./ImageUpload.jsx";
import Image from "./Image.jsx";
import RefTempAndMessage from "./RefTempAndMessage.jsx";
import ModalRef from "./ModalRef.jsx";
import ExitConfirmation from "./ExitConfirmation.jsx";
import Modalperson from "./Modalperson.jsx";

const ManageSetting = () => {
  const [QRModal, setQRModal] = useState(false);
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalperson, setModalperson] = useState(false);
  const [modalres, setModalres] = useState(false);
  const [modalref, setModalref] = useState(false);
  const [residents, setResidents] = useState([]);
  const [temperatureStatus, setTemperatureStatus] = useState("normal"); // 추가: 온도 상태
  const location = useLocation();
  const navigate = useNavigate();
  const refrigerator_id = location.state?.refrigerator_id || null;
  const token = localStorage.getItem("token");
  const admin_id = jwtDecode(token).admin_id;

  // 배경색 결정 함수
  const getBackgroundColor = () => {
    return temperatureStatus === "danger" ? "bg-red-200" : "bg-white";
  };

  console.log(refrigerator_id);
  const handleModalresClose = () => {
    setModalres(false);
  };
  const handleModalpersonClose = () => {
    setModalperson(false);
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
        console.log("실패함");
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
    console.log("Modal 상태:", modalperson);
  }, [modalperson]);

  const fetchPerson = async () => {
    const response = await axios
      .get(
        `${
          import.meta.env.VITE_SERVER_URL
        }:9999/api/refrigerator/?admin=${admin_id}`
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
          setting_temp_value: item.setting_temp_value,
          refrigerator_type: item.refrigerator_type,
          check_refrigerator: item.check_refrigerator,
          defrost_value: item.defrost_value,
          defrost_term: item.defrost_term,
          defrost_time: item.defrost_time,
          entry_reservation: item.entry_reservation,
          check_defrost: item.check_defrost,
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

  // 출관 성공 시 처리 함수
  const handleExitSuccess = () => {
    const updatedPerson = person.filter(
      (item) => item.refrigerator_id !== parseInt(refrigerator_id, 10)
    );
    setPerson(updatedPerson);
  };

  return (
    <div className={getBackgroundColor()}>
      {" "}
      {/* 배경색 동적 적용 */}
      <h1 onClick={() => navigate("/main")}>🏠</h1>
      <div
        className="personBox"
        style={{
          backgroundColor: temperatureStatus === "danger" ? "#fee2e2" : "white",
        }}
      >
        <p>관리번호: {currentPerson.management_number}</p>
        <p>냉장고: {currentPerson.refrigerator_number}</p>
        <h3>고인명: {currentPerson.person_name}</h3>
        <div>
          <Image refrigerator_id={refrigerator_id} />
        </div>
        <h3>생년월일: {currentPerson.person_birthday}</h3>
        <p>
          입관일: {currentPerson.entry_date}
          {currentPerson.entry_reservation && (
            <span style={{ marginLeft: "5px", color: "green" }}>✓</span>
          )}
        </p>
        <p>출관일: {currentPerson.exit_date}</p>
        {residents.map((resident, j) => (
          <p key={j}>
            상주 {j + 1}: {resident.resident_name} {resident.phone_number}
          </p>
        ))}
        <RefTempAndMessage
          refrigerator_number={currentPerson.refrigerator_number}
          refrigerator_id={currentPerson.refrigerator_id}
          setting_temp_value={currentPerson.setting_temp_value} // 추가
          onTemperatureChange={setTemperatureStatus} // 추가
        />
        <p>설정온도: {currentPerson.setting_temp_value}°C</p> {/* 추가 */}
        <p>
          상태:
          <span
            style={{
              color: currentPerson.check_defrost ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {currentPerson.check_defrost ? " 제상중" : " 냉장중"}
          </span>
        </p>
        <button onClick={() => setModalperson(!modalperson)}>
          고인 정보 입력
        </button>
        <button onClick={() => setModalres(!modalres)}>상주 정보 입력</button>
        <button onClick={() => setModalref(!modalref)}>온도 설정</button>
        <button onClick={() => setQRModal(true)}>QR 밴드 출력</button>
        <ImageUpload refrigerator_id={refrigerator_id} />
        <ExitConfirmation
          refrigerator_id={refrigerator_id}
          residents={residents}
          onExitSuccess={handleExitSuccess}
          currentPerson={currentPerson}
          allRefrigerators={person}
        />
        {modalperson && (
          <Modalperson
            person={currentPerson}
            onClose={handleModalpersonClose}
          />
        )}
        {modalres && (
          <ModalRes
            person={currentPerson}
            residents={residents}
            onClose={() => setModalres(false)}
          />
        )}
        {modalref && (
          <ModalRef person={currentPerson} onClose={handleModalrefClose} />
        )}
        {QRModal && (
          <QRcode
            open={QRModal}
            value={currentPerson}
            onClose={() => setQRModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ManageSetting;
