import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ModalTelegram = ({ open, onClose }) => {
  const [adminId, setAdminId] = useState(null);
  const [telegrams, setTelegrams] = useState(
    Array.from({ length: 10 }, () => ({
      telegram_id: null,
      telegram_user_id: '',
      deleteChecked: false,
    }))
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const adminId = decoded.admin_id;
      setAdminId(adminId);

      const fetchTelegrams = async () => {
        try {
          const res = await axios.get(
            `${
              import.meta.env.VITE_SERVER_URL
            }:57166/api/telegram/?admin_id=${adminId}`
          );
          const fetched = res.data.data || [];

          const filledTelegrams = Array.from({ length: 10 }, (_, index) => {
            const item = fetched[index];
            return item
              ? {
                  telegram_id: item.telegram_id,
                  telegram_user_id: item.telegram_user_id,
                  deleteChecked: false,
                }
              : {
                  telegram_id: null,
                  telegram_user_id: '',
                  deleteChecked: false,
                };
          });

          setTelegrams(filledTelegrams);
          console.log('받아온 텔레그램 리스트:', res.data);
        } catch (err) {
          console.error('텔레그램 정보 불러오기 실패:', err);
        }
      };

      fetchTelegrams();
    }
  }, [open]);

  const handleChange = (index, key, value) => {
    setTelegrams((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    try {
      const deletePromises = telegrams
        .filter((t) => t.deleteChecked && t.telegram_id)
        .map((t) =>
          axios.delete(
            `${import.meta.env.VITE_SERVER_URL}:57166/api/telegram/${
              t.telegram_id
            }`
          )
        );

      const upsertPromises = telegrams
        .filter((t) => !t.deleteChecked && t.telegram_user_id.trim() !== '')
        .map((t) => {
          if (t.telegram_id) {
            return axios.put(
              `${import.meta.env.VITE_SERVER_URL}:57166/api/telegram/${
                t.telegram_id
              }`,
              {
                telegram_id: t.telegram_id,
                telegram_user_id: t.telegram_user_id,
                admin_id: adminId,
              }
            );
          } else {
            return axios.post(
              `${import.meta.env.VITE_SERVER_URL}:57166/api/telegram`,
              { telegram_user_id: t.telegram_user_id, admin_id: adminId }
            );
          }
        });

      await Promise.all([...deletePromises, ...upsertPromises]);
      alert('텔레그램 정보가 저장되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="modal-overlay" style={{ display: open ? 'flex' : 'none' }}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <h2 className="modal-title">텔레그램 ID 관리</h2>

        <div className="telegrams-form">
          {telegrams.map((tel, index) => (
            <div key={index} className="telegram-form-group">
              <div className="telegram-header">
                <h4 style={{ marginTop: '10px' }}>Telegram ID {index + 1}</h4>
                {tel.telegram_id && (
                  <label className="delete-checkbox">
                    <input
                      type="checkbox"
                      checked={tel.deleteChecked}
                      onChange={(e) =>
                        handleChange(index, 'deleteChecked', e.target.checked)
                      }
                    />
                    <span>삭제</span>
                  </label>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="예: 7161720096"
                  value={tel.telegram_user_id}
                  onChange={(e) =>
                    handleChange(index, 'telegram_user_id', e.target.value)
                  }
                  className="form-input"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="modal-button-group">
          <button className="cancel-btn" onClick={onClose}>
            닫기
          </button>
          <button
            className="submit-btn"
            onClick={async () => {
              await handleSave();
              onClose();
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTelegram;
