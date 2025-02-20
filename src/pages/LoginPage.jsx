import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';

import { Nav } from 'react-bootstrap';

const LoginPage = ({ setAuth }) => {
  let [tap, setTap] = useState(0);
  return (
    <div className="form-wrapper">
      {' '}
      {/* 중앙 정렬을 위한 컨테이너 */}
      <Nav variant="tabs" defaultActiveKey="link0">
        <Nav.Item>
          <Nav.Link
            eventKey="link0"
            onClick={() => {
              setTap(0);
            }}
          >
            ADMIN
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="link1"
            onClick={() => {
              setTap(1);
            }}
          >
            Bistech
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {tap == 0 ? <LoginForm setAuth={setAuth} loginType="Normal" /> : null}
      {tap == 1 ? <LoginForm setAuth={setAuth} loginType="Bistech" /> : null}
    </div>
  );
};

export default LoginPage;
