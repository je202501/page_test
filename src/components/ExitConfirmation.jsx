import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExitConfirmation = ({ refrigerator_id, residents, onExitSuccess }) => {
  const navigate = useNavigate();

  const handleExitConfirm = async () => {
    const isConfirmed = window.confirm(
      "출관 확인을 하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (isConfirmed) {
      try {
        const data = {
          person_name: "",
          person_birthday: "",
          entry_date: "",
          exit_date: "",
          setting_temp_value: "30",
          defrost_value: "0",
        };
        await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }:9999/api/refrigerator/${refrigerator_id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // 상주 정보 삭제
        for (const resident of residents) {
          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}:9999/api/resident/${
              resident.resident_id
            }`
          );
        }

        alert("출관 처리되었습니다.");
        onExitSuccess(); // 성공 콜백 호출
        navigate("/main"); // 관리 페이지로 이동
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("출관 처리에 실패했습니다.");
      }
    }
  };

  return <button onClick={handleExitConfirm}>출관 확인</button>;
};

export default ExitConfirmation;
