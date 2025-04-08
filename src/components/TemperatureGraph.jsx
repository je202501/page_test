import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { getAdmin } from "../components/service/adminService"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { jwtDecode } from "jwt-decode";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
console.log(SOCKET_SERVER_URL)
/**
 * data는 온도 데이터
 * adminInfo는 어드민 데이터
 * refrigeratorInfo는 냉장고 데이터
 */
const TemperatureGraph = () => {
    const [data, setData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [adminInfo, setAdminInfo] = useState([]);
    const [refrigeratorInfo, setRefrigeratorInfo] = useState([]);

    /**
     * 어드민 정보 가져오기
     */
    useEffect(() => {
        if (token) {
            const fetchAdmin = async () => {
                try {
                    const data = await getAdmin();
                    setAdminInfo(data);
                } catch (error) {
                    console.error('어드민 정보 가져오기 실패', error)
                }
            }
            fetchAdmin();
        }
    }, [])


    /**
     * 소켓 연결시도 & 통신
     */
    useEffect(() => {
        console.log("소켓 연결 시도:", SOCKET_SERVER_URL);
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket", "polling"], // WebSocket 사용 안 하고 HTTP 폴링만 사용
            reconnection: true, // 자동 재연결 활성화
            reconnectionAttempts: 5, // 최대 5번 재시도
            reconnectionDelay: 3000, // 3초 후 재시도
        });

        socket.on("connect", () => {
            console.log("소켓 연결 성공!");
        });

        socket.on("disconnect", () => {
            console.warn("소켓 연결이 끊어졌습니다.");
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log(`소켓 재연결 시도 (${attempt})`);
        });

        socket.on("temperatureUpdate", (newTemp) => {
            console.log("기존 온도 데이터 수신:", newTemp);
            setData((prevData) => [
                ...prevData,
                { temperature: data.temperature, time: data.timestamp }
            ]);
        });

        socket.on("newTemperature", (newTemp) => {
            console.log("새 온도 데이터 수신:", newTemp);
            const prevData = data;
            // console.log(prevData)
            setData((prevData) => [
                ...prevData,
                {
                    temperature: newTemp.temperature,  // 온도 데이터
                    time: newTemp.createAt || Date.now(), // timestamp가 없으면 현재 시간 사용
                    refrigerator_id: newTemp.refrigerator_id,
                }
            ]);
        });

        return () => {
            console.log("소켓 연결 해제");
            socket.disconnect();
        };
    }, []);

    /**
     * 어드민 데이터 정제후 냉장고 정보 가져오는 코드
     */
    useEffect(() => {
        if (adminInfo.data) {
            const admin_data = adminInfo.data;
    
            const refrigeratorIdMap = {}; // refrigerator_id로 바로 접근 가능하게 변환
    
            admin_data.forEach(({ admin_name, Refrigerators }) => {
                if (Array.isArray(Refrigerators)) {
                    Refrigerators.forEach(refrigerator => {
                        refrigeratorIdMap[refrigerator.refrigerator_id] = {
                            ...refrigerator,
                            admin_name
                        };
                    });
                }
            });
    
            setRefrigeratorInfo(refrigeratorIdMap); // refrigerator_id 기반으로 설정
            console.log(refrigeratorIdMap, "<<r info");
        }
    }, [adminInfo]);
    

    /**
     * 그래프 그룹화 시도
     */
    useEffect(() => {
        if (data.length > 0 && refrigeratorInfo) {
            const groupedData = data.reduce((acc, curr) => {
                const { refrigerator_id } = curr;

                // refrigerator_id가 refrigeratorInfo에 존재하는지 확인
                if (refrigeratorInfo[refrigerator_id]) {
                    if (!acc[refrigerator_id]) {
                        acc[refrigerator_id] = {
                            refrigeratorInfo: refrigeratorInfo[refrigerator_id], // 냉장고 정보
                            temperatureData: [], // 온도 데이터 저장할 배열
                        };
                    }

                    acc[refrigerator_id].temperatureData.push(curr);
                }

                return acc;
            }, {});

            console.log(groupedData, "<<<< groupedData"); // 최종 결과 확인
        }
    }, [data, refrigeratorInfo]); // data 또는 refrigeratorInfo 변경 시 실행


    const groupedData = useMemo(() => {
        return data.reduce((acc, curr) => {
            const { refrigerator_id } = curr;
            console.log(refrigeratorInfo,"<<rinfo")
            if (!acc[refrigerator_id]) {
                acc[refrigerator_id] = {
                    info: refrigeratorInfo[refrigerator_id],
                    data: []
                };
            }
            acc[refrigerator_id].data.push(curr);
            return acc;
        }, {});
    }, [data, refrigeratorInfo]);

    console.log(groupedData,"<<<<G data")

    /**
     * 그래프 그리기
     */
    return (
        <div style={{ width: "80%", margin: 30 }}>
            <h2>실시간 온도 그래프</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {Object.entries(groupedData).map(([refrigerator_id, group]) => (
                    <div key={refrigerator_id} style={{ width: "30%" }}>
                        <h3>{`${group.info.admin_name} ${group.info.refrigerator_number}`}</h3>
                        <ResponsiveContainer width="110%" height={300}>
                            <LineChart data={group.data}>
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(time) =>
                                        new Intl.DateTimeFormat("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }).format(new Date(time))
                                    }
                                />
                                <YAxis domain={[-20, 10]} />
                                <Tooltip
                                    labelFormatter={(value) =>
                                        new Intl.DateTimeFormat("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }).format(new Date(value)) // 툴팁에서도 동일하게 시간 포맷
                                    }
                                />
                                <Line type="linear" dataKey="temperature" stroke="#8884d8" dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemperatureGraph;
