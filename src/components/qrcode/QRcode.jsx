import Modal from '../modal/Modal';
import { useState, useEffect } from 'react';
import Button from '../Button';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
const QRcode = (props) => {
  const { open, onClose, value } = props;
  if (!open) return;
  const data = `이름 : ${value.person_name}\n생년월일 : ${value.person_birthday}`;
  console.log(value);
  return (
    <>
      <Modal open={open} width={821}>
        <Container>
          <QRCodeWrap>
            <QRCodeCanvas value={data} size={250} />
          </QRCodeWrap>
          <ButtonWrap>
            <Button
              text={`확인`}
              onClick={() => {
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
