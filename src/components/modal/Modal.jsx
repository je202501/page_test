import { ReactNode } from 'react';
import { Mask } from 'antd-mobile';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;
const ModalWindow = styled.div`
  width: ${({ $width }) => `${$width}px`};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 15px;
  box-sizing: border-box;
`;
const Modal = (props) => {
  const { open = false, children, width = 500 } = props;
  return (
    <Mask visible={open}>
      <Container>
        <ModalWindow $width={width}>{children}</ModalWindow>
      </Container>
    </Mask>
  );
};
export default Modal;
