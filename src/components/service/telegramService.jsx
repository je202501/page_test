/**
 * 텔레그램 조회 api
 * @param {admin_id}
 * @returns 텔레그램 정보
 */
export const getTelegram = async (admin_id) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}:9999/api/telegram/${admin_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`서버 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('텔레그램 데이터 가져오기 실패:');
    throw error;
  }
};
/**
 * 텔레그램 생성 api
 * @param {telegram_user_id, admin_id}
 */
export const postTelgram = async (telegramUserId, adminId, token) => {
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
        body: JSON.stringify({
          telegram_user_id: telegramUserId,
          admin_id: adminId,
        }),
      }
    );

    const data = await response.json();
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
 * 텔레그램 메시지 전송 api
 * @param {telegram_user_id}
 */
export const messageTelegram = async (adminId, token, error_message) => {
  try {
    if (!token) throw new Error('토큰이 없습니다.');

    const getTelegramData = await getTelegram(adminId);
    console.log('텔레그램 유저 정보:', getTelegramData.data.telegram_user_id);
    console.log('전송할 메시지:', error_message);
    const telegram_user_id = getTelegramData.data.telegram_user_id;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}:9999/api/telegram/telegram_message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          telegram_user_id: telegram_user_id,
          message: error_message,
        }),
      }
    );
    return response;
  } catch (e) {
    alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
