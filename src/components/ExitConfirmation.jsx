import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExitConfirmation = ({
  refrigerator_id,
  residents,
  onExitSuccess,
  currentPerson,
  allRefrigerators,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // NO. 접두사 처리 함수
  const formatRefNumber = (num, withPrefix = true) => {
    return withPrefix ? `NO.${num.replace("NO.", "")}` : num.replace("NO.", "");
  };

  // 연관 냉장고 번호 추출
  const getPairedRefNumber = (num) => {
    const cleanNum = formatRefNumber(num, false);
    const [prefix, suffix] = cleanNum.split("-");
    return `NO.${prefix}-${suffix === "1" ? "2" : "1"}`;
  };

  // 이미지 삭제
  const deleteImage = async () => {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}:9999/api/image/ref/${refrigerator_id}`
    );
  };

  // 냉장고 초기화 (보존 필드 제어)
  const resetRefrigerator = async (fridgeId, options = {}) => {
    const { preserveTemp = false, preserveDefrost = false } = options;

    const data = {
      person_name: "",
      person_birthday: "",
      entry_date: "",
      exit_date: "",
      ...(preserveTemp ? {} : { setting_temp_value: "30" }),
      ...(preserveDefrost ? {} : { defrost_value: "0" }),
    };

    await axios.put(
      `${import.meta.env.VITE_SERVER_URL}:9999/api/refrigerator/${fridgeId}`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const handleExitConfirm = async () => {
    if (
      !window.confirm(
        "출관 확인을 하시겠습니까? (고인 정보, 상주 정보, 이미지가 모두 삭제됩니다)"
      )
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 이미지 삭제 (모든 경우 필수)
      await deleteImage();

      // 2. 보존 옵션 초기화
      let preserveOptions = {
        preserveTemp: false,
        preserveDefrost: false,
      };

      // 3. 타입 A인 경우 연관 냉장고 확인
      if (currentPerson.refrigerator_type === "A") {
        const pairedNumber = getPairedRefNumber(
          currentPerson.refrigerator_number
        );
        const pairedFridge = allRefrigerators.find(
          (f) => f.refrigerator_number === pairedNumber
        );

        if (pairedFridge?.person_name) {
          preserveOptions = {
            preserveTemp: true, // setting_temp_value 보존
            preserveDefrost: true, // defrost_value 보존
          };
        } else {
          // 연관 냉장고 초기화 (온도/해동 값 모두 초기화)
          await resetRefrigerator(pairedFridge.refrigerator_id);
        }
      }

      // 4. 현재 냉장고 초기화
      await resetRefrigerator(refrigerator_id, preserveOptions);

      // 5. 상주 정보 삭제
      for (const resident of residents) {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}:9999/api/resident/${
            resident.resident_id
          }`
        );
      }

      alert("출관 처리 완료");
      onExitSuccess();
      navigate("/main");
    } catch (error) {
      console.error("출관 실패:", error);
      alert(`출관 실패: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleExitConfirm}
      disabled={isProcessing}
      className="exit-btn"
    >
      {isProcessing ? "처리 중..." : "출관 확인"}
    </button>
  );
};

export default ExitConfirmation;
