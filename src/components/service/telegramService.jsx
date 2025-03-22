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
        console.error("텔레그램 데이터 가져오기 실패:", error);
        throw error;
    }
};
