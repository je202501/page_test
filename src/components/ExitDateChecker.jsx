import React, { useEffect, useRef, useState } from 'react';
import { messageTelegram } from './service/telegramService';
import { jwtDecode } from 'jwt-decode';

const ExitDateChecker = ({ refrigerator_number, exit_date }) => {
  const alertSentRef = useRef(false);
  const prevExitDateRef = useRef(null);
  const timerRef = useRef(null);
  const isSendingRef = useRef(false); // 추가: 메시지 발송 중 상태 추적
  const [checkMessage, setCheckMessage] = useState(false);

  const isExitDatePassed = (dateToCheck) => {
    if (!dateToCheck) return false;
    return new Date() > new Date(dateToCheck);
  };

  const sendTelegramMessage = async (currentExitDate) => {
    if (isSendingRef.current || alertSentRef.current) return;

    isSendingRef.current = true;
    // console.log('메시지 발송 시도:', currentExitDate);
    // console.log(`${checkMessage} <<<<<<<<<<<<`);
    try {
      const token = localStorage.getItem('token');
      if (!token || !checkMessage) return;

      const decoded = jwtDecode(token);
      await messageTelegram(
        decoded.admin_id,
        token,
        `[출관일 알림] 냉장고 ${refrigerator_number}의 출관일이 지났습니다.\n` +
          `- 출관일: ${new Date(currentExitDate).toLocaleString()}\n`
      );

      alertSentRef.current = true;
      // console.log('메시지 발송 성공');
      setCheckMessage(false);
    } catch (error) {
      console.error('메시지 발송 실패:', error);
      alertSentRef.current = false; // 실패 시 재시도 가능하도록
    } finally {
      isSendingRef.current = false;
    }
  };

  const checkAndNotify = () => {
    if (!exit_date) {
      setCheckMessage(true);
      alertSentRef.current = false;
      return;
    }

    const isPassed = isExitDatePassed(exit_date);
    // console.log(
    //   `체크: ${exit_date}, 지남? ${isPassed}, 이미 발송? ${alertSentRef.current}`
    // );

    if (isPassed && !alertSentRef.current) {
      sendTelegramMessage(exit_date);
    } else if (!isPassed) {
      alertSentRef.current = false;
    }
  };

  useEffect(() => {
    // 변경 감지 및 초기 확인
    if (prevExitDateRef.current !== exit_date) {
      alertSentRef.current = false;
      prevExitDateRef.current = exit_date;
      // console.log('출관일 변경 감지:', exit_date);
      checkAndNotify();
    }

    // 타이머 설정
    timerRef.current = setInterval(checkAndNotify, 60000);

    return () => {
      // console.log('컴포넌트 정리');
      clearInterval(timerRef.current);
    };
  }, [exit_date, refrigerator_number]);

  return (
    <div>
      {exit_date ? (
        <span
          style={{
            color: isExitDatePassed(exit_date) ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {isExitDatePassed(exit_date) ? '출관일 지남' : '출관일 이전'}
        </span>
      ) : (
        <span style={{ color: 'gray' }}>출관일 미설정</span>
      )}
    </div>
  );
};

export default ExitDateChecker;
