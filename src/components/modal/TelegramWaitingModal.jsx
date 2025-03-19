import Modal from '../modal/Modal';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Button from '../Button';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * 텔레그램 아이디를 받아 API를 쏘는 함수
 */
const settingTelegram = async (telegramUserId) => {
    try {
        // 여기에 API 호출 로직 추가
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('토큰이 없습니다.');
        }
        /**
         * 토큰에서 어드민 아이디 추출
         */
        const decodedToken = jwtDecode(token);
        const adminId = decodedToken.admin_id;
        /**
         * 서버에 요청하는 코드
         */
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}:9999/api/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                telegram_user_id: telegramUserId,
                admin_id: adminId,
            }),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (data.status === 200) {
            // 성공적으로 처리되었을 때의 로직
            alert('텔레그램 아이디가 설정되었습니다.');
        } else {
            // 실패했을 때의 로직
            alert(`${data.data}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
}


/**
 *텔레그램 아이디 받는 모듈
 */
const TelegramWaitingModal = (props) => {
    const { open, onClose } = props;
    const [telegramUserId, setTelegramUserId] = useState('');
    // 아이디 입력 핸들러
    const handleInputChange = (e) => {
        setTelegramUserId(e.target.value);
    };
    const handleSubmit = () => {
        if (telegramUserId) {
            settingTelegram(telegramUserId);  // API 호출
            onClose();  // 모달 닫기
        } else {
            alert('텔레그램 아이디를 입력해주세요.');
        }
    };
    if (!open) return;
    return (
        <>
            <Modal open={open} width={821}>
                <Container>
                    <ContentText>텔레그램 아이디를 입력해주세요</ContentText>
                    <Input
                        type="text"
                        value={telegramUserId}
                        onChange={handleInputChange}
                        placeholder="텔레그램 아이디"
                    />
                    <Button
                        text={`확인`}
                        onTouchClick={() => {
                            handleSubmit();
                        }}
                        backgroundColor={'#007BFF'}
                        color="#FFFFFF"
                    ></Button>
                </Container>
            </Modal>
        </>
    )
}

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
`
const Input = styled.input`
  padding: 10px;
  font-size: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
`;

export default TelegramWaitingModal;