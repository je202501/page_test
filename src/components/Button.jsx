import { ReactNode } from 'react';
import styled from 'styled-components';
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
  svg {
    width: 24px;
    height: 24px;
    fill: #66ff66; /* 아이콘 색상 */
  }
`;
const ButtonText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ $color }) => $color}; /* 텍스트 색상 */
  letter-spacing: 0.5px;
`;
const Button = (props) => {
  const {
    icon,
    text,
    backgroundColor = '#fff',
    color = '#800000',
    onClick,
  } = props;
  const handleTouchClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <ButtonContainer
      $backgroundColor={backgroundColor}
      onTouchClick={handleTouchClick}
    >
      <IconWrapper>{icon}</IconWrapper>
      <ButtonText $color={color}>{text}</ButtonText>
    </ButtonContainer>
  );
};
export default Button;
