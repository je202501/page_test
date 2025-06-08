import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ModalRes from "./ModalRes.jsx";
import QRcode from "./qrcode/QRcode";
import ImageUpload from "./ImageUpload.jsx";
import Image from "./Image.jsx";
import RefrigeratorTemperature from "./RefrigeratorTemperature.jsx";
import ModalRef from "./ModalRef.jsx";
import ExitConfirmation from "./ExitConfirmation.jsx";
import Modalperson from "./Modalperson.jsx";

//설정페이지
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

  // console.log(refrigerator_id);
  //모달 핸들 함수
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
        // console.log("실패함");
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

  //냉장고 데이터 가져오기
  const fetchPerson = async () => {
    const response = await axios
      .get(
        `${import.meta.env.VITE_SERVER_URL
        }:9999/api/refrigerator/?admin=${admin_id}`
      )
      .then((res) => {
        // console.log(`데이터:${res.data}`);
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
  //냉장고 id가 같은 상주 데이터 가져오기기
  const fetchResidents = async () => {
    const response = await axios
      .get(`${import.meta.env.VITE_SERVER_URL}:9999/api/resident`)
      .then((res) => {
        // console.log(`상주:${res.data.data}`);
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
    <div
      className={`refrigerator-detail ${temperatureStatus === "danger" ? "danger-mode" : ""
        }`}
    >
      <div className="refrigerator-card">
        <div className="refrigerator-header">
          <h3>{currentPerson.refrigerator_number}</h3>
          <span className="management-number">
            {currentPerson.management_number}
          </span>
        </div>

        <div className="person-info">
          <div className="person-image">
            <Image refrigerator_id={refrigerator_id} />
          </div>
          <br />
          <div className="person-details">
            <h2>{currentPerson.person_name}</h2>
            <br />
            <div className="date-info">
              <div>
                <span className="label">관리번호:</span>
                <span>{currentPerson.management_number}</span>
              </div>
            </div>
            <div className="date-info">
              <div>
                <span className="label">생년월일:</span>
                <span>{currentPerson.person_birthday}</span>
              </div>
            </div>
            <div className="date-info">
              <div>
                <span className="label">입관일:</span>
                <span>
                  {currentPerson.entry_date}
                  {currentPerson.entry_reservation && (
                    <span className="reservation-badge">✓</span>
                  )}
                </span>
              </div>
              <div>
                <span className="label">출관일:</span>
                <span>{currentPerson.exit_date}</span>
              </div>
            </div>
            <div className="date-info">
              <div>
                <span className="label">냉장온도:</span>
                <span>{currentPerson.setting_temp_value}</span>
              </div>
            </div>
            <div className="date-info">
              <div>
                <span className="label">제상온도:</span>
                <span>{currentPerson.defrost_value}</span>
              </div>
              <div>
                <span className="label">제상주기:</span>
                <span>{Number(currentPerson.defrost_term) / 60}</span>
                <span className="label">시간 마다</span>
              </div>
              <div>
                <span>{currentPerson.defrost_time}</span>
                <span className="label">분 동안</span>
              </div>
            </div>
            <div>
              <RefrigeratorTemperature
                refrigerator_number={currentPerson.refrigerator_number}
                refrigerator_id={currentPerson.refrigerator_id}
                setting_temp_value={currentPerson.setting_temp_value}
                onTemperatureChange={setTemperatureStatus}
              />
              <span
                className={`status ${currentPerson.check_defrost ? "defrosting" : "cooling"
                  }`}
              >
                {currentPerson.check_defrost ? "제상중" : "냉장중"}
              </span>
            </div>
          </div>
        </div>
        <br />

        <div className="residents-section">
          <h4>상주 정보</h4>
          {residents.map((resident, j) => (
            <div key={j} className="resident-item">
              <span>상주 {j + 1}:</span>
              <span>{resident.resident_name}</span>
              <span>{resident.phone_number}</span>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => setModalperson(!modalperson)}
          >
            고인 정보 수정
          </button>
          <button className="action-btn" onClick={() => setModalres(!modalres)}>
            상주 정보 관리
          </button>
          <button className="action-btn" onClick={() => setModalref(!modalref)}>
            냉장 제상 설정
          </button>
          <ImageUpload refrigerator_id={refrigerator_id} />
          <button className="action-btn" onClick={() => setQRModal(true)}>
            QR 코드 생성
          </button>
          <ExitConfirmation
            refrigerator_id={refrigerator_id}
            residents={residents}
            onExitSuccess={handleExitSuccess}
            currentPerson={currentPerson}
            allRefrigerators={person}
          />
        </div>
      </div>

      {modalperson && (
        <Modalperson person={currentPerson} onClose={handleModalpersonClose} />
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
  );
};

export default ManageSetting;
