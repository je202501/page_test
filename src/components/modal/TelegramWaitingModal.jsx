import Modal from '../modal/Modal';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Button from '../Button';
import styled from 'styled-components';
import { getTelegram, postTelgram } from '../service/telegramService';

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
                } catch (e) {
                    setTelegramInfo(null);
                }
            };
            fetchTelegram();
        }
    }, [token, open]);

    const handleInputChange = (e) => setTelegramUserId(e.target.value);

    const handleSubmit = () => {
        if (!telegramUserId) {
            alert('텔레그램 아이디를 입력해주세요.');
            return;
        }
        const decodedToken = jwtDecode(token);
        const adminId = decodedToken.admin_id;
        postTelgram(telegramUserId, adminId, token);
        onClose(); // 모달 닫기
    };

    if (!open) return null;

    return (
        <Modal open={open} width={821}>
            <Container>
                <ContentText>텔레그램 아이디를 입력해주세요</ContentText>
                <VelueText>현재 텔레그램 아이디 : {telegramInfo ?? "없음"}</VelueText>
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
