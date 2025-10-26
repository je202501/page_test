export const getAdmin = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}:51766/api/admin`,
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
    console.error('관리자 데이터 가져오기 실패:', error);
    throw error;
  }
};
