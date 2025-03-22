import Modal from '../modal/Modal';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Button from '../Button';
import styled from 'styled-components';
import { getTelegram } from '../service/telegramService';

/**
 * 텔레그램 아이디를 받아 API를 요청하는 함수
 */
const settingTelegram = async (telegramUserId, adminId, token) => {
    try {
        if (!token) throw new Error('토큰이 없습니다.');

        const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}:9999/api/telegram`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ telegram_user_id: telegramUserId, admin_id: adminId }),
            }
        );

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            alert('텔레그램 아이디가 설정되었습니다.');
        } else {
            alert(`실패: ${data.message || '알 수 없는 오류'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
};

/**
 * 텔레그램 아이디 입력 모달
 */
const TelegramWaitingModal = ({ open, onClose }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [telegramUserId, setTelegramUserId] = useState('');
    const [telegramInfo, setTelegramInfo] = useState(null);

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const adminId = decodedToken.admin_id;

            const fetchTelegram = async () => {
                try {
                    const data = await getTelegram(adminId);
                    setTelegramInfo(data.data.telegram_user_id);
                } catch (error) {
                    console.error('텔레그램 데이터 가져오기 실패:', error);
                }
            };
            fetchTelegram();
        }
    }, [token,open]);

    const handleInputChange = (e) => setTelegramUserId(e.target.value);

    const handleSubmit = () => {
        if (!telegramUserId) {
            alert('텔레그램 아이디를 입력해주세요.');
            return;
        }
        const decodedToken = jwtDecode(token);
        const adminId = decodedToken.admin_id;
        settingTelegram(telegramUserId, adminId, token);
        onClose(); // 모달 닫기
    };

    if (!open) return null;

    return (
        <Modal open={open} width={821}>
            <Container>
                <ContentText>텔레그램 아이디를 입력해주세요</ContentText>
                <VelueText>현재 텔레그램 아이디 : {telegramInfo?? "없음"}</VelueText>
                <Input type="text" value={telegramUserId} onChange={handleInputChange} placeholder="텔레그램 아이디" />
                <ButtonWrapper>
                    <Button text="확인" onTouchClick={handleSubmit} backgroundColor="#007BFF" color="#FFFFFF" />
                    <Button text="취소" onTouchClick={onClose} backgroundColor="#007BFF" color="#FFFFFF" />
                </ButtonWrapper>
            </Container>
        </Modal>
    );
};

// 스타일링
const Container = styled.div`
  display: flex;
  margin: 100px 80px 60px 80px;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const ContentText = styled.pre`
  font-size: 45px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 600;
  gap: 10px;
`;
const VelueText = styled.pre`
  font-size: 30px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 600;
  gap: 10px;
`;
const Input = styled.input`
  padding: 10px;
  font-size: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
`;
const ButtonWrapper = styled.div`
  width: 624px;
  display: flex;
  gap: 10px;
  margin: 0 auto;
  align-items: center;
`;

export default TelegramWaitingModal;
