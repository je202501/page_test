import React, { useState } from "react";
import MainNavbar from "../components/MainNavbar";
import ManageSetting from "../components/ManageSetting";
import TelegramWaitingModal from "../components/modal/TelegramWaitingModal";
import ModalTelegram from "../components/modal/ModalTelegram";
import "./MainPage.css";

const SettingPage = ({ setAuth }) => {
  const [telegramModal, setTelegramModal] = useState(false);

  return (
    <div className="main-page">
      <div className="main-container">
        <MainNavbar
          setAuth={setAuth}
          onTelegramClick={() => setTelegramModal(true)}
        />

        <main className="content-area">
          <ManageSetting />
        </main>

        <ModalTelegram
          open={telegramModal}
          onClose={() => setTelegramModal(false)}
        />
      </div>
    </div>
  );
};

export default SettingPage;
