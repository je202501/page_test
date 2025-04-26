import Modal from '../modal/Modal';
import { useState, useEffect } from 'react';
import Button from '../Button';
import styled from 'styled-components';
import { getResident } from '../service/residentService';
import { QRCodeCanvas } from 'qrcode.react';
const QRcode = (props) => {
  const [residentData, setResidentData] = useState();
  const { open, onClose, value } = props;
  if (!open) return;
  useEffect(() => {
    if (value) {
      const fetchResident = async () => {
        try {
          const res = await getResident(value.refrigerator_id);
          const resData = res.data.find((resident) => resident.primary_resident === true)
          const data = `이름 : ${value.person_name}\n생년월일 : ${value.person_birthday}\n대표상주 : ${resData?.resident_name ?? "대표 상주 등록 안 됨"}\n전화번호 : ${resData?.phone_number ?? "대표 상주 등록 안 됨"}`;
          setResidentData(data)
        } catch (err) {
          console.error('상주 정보 가져오기 실패:', err);
        }
      };

      fetchResident();
    }
  }, [value])
  return (
    <>
      <Modal open={open} width={821}>
        <Container>
          <QRCodeWrap>
            <QRCodeCanvas value={residentData} size={250} />
          </QRCodeWrap>
          <ButtonWrap>
            <Button
              text={`확인`}
              onTouchClick={() => {
                onClose();
              }}
              backgroundColor={'#007BFF'}
              color="#FFFFFF"
            ></Button>
          </ButtonWrap>
        </Container>
      </Modal>
    </>
  );
};
const Container = styled.div`
  display: flex;
  margin: 100px 80px 60px 80px;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const ButtonWrap = styled.div`
  display: flex;
  margin: 40px;
  align-items: center;
  flex-direction: row;
  width: 100%;
  gap: 20px;
`;
const QRCodeWrap = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default QRcode;
