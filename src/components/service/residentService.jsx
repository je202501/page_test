export const getResident = async (Info) => {
  /**
   * Info = refrigerator_id
   * 냉장고 번호를 이용한 상주 조회
   */
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}:${
        import.meta.env.VITE_SERVER_PORT
      }/api/resident/?refrigerator_id=${Info}`,
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
  } catch (e) {
    throw error;
  }
};
