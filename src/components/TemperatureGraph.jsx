import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { getAdmin } from "../components/service/adminService"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { jwtDecode } from "jwt-decode";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
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
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket", "polling"], // WebSocket 사용 안 하고 HTTP 폴링만 사용
            reconnection: true, // 자동 재연결 활성화
            reconnectionAttempts: 5, // 최대 5번 재시도
            reconnectionDelay: 3000, // 3초 후 재시도
        });

        socket.on("connect", () => {
        });

        socket.on("disconnect", () => {
        });

        socket.on("reconnect_attempt", (attempt) => {
        });

        socket.on("newTemperature", (newTemp) => {
            setData((prevData) => {
                const updatedData = [
                    ...prevData,
                    {
                        temperature: newTemp.temperature,  // 온도 데이터
                        out_temperature_value: newTemp.out_temperature_value,
                        setting_temp_value: newTemp.setting_temp_value,
                        current_value: newTemp.current_value,
                        time: newTemp.createAt || Date.now(), // timestamp가 없으면 현재 시간 사용
                        refrigerator_id: newTemp.refrigerator_id,
                    }
                ];
                /**
                 * 각 냉장고별로 그룹화해서 자르는 코드
                 */
                const grouped = updatedData.reduce((acc, item) => {
                    const id = item.refrigerator_id;
                    if (!acc[id]) acc[id] = [];
                    acc[id].push(item);
                    return acc;
                }, {});
                const trimmed = Object.values(grouped).flatMap(group => group.slice(-20));

                return trimmed;
            });
        });

        return () => {
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

        }
    }, [data, refrigeratorInfo]); // data 또는 refrigeratorInfo 변경 시 실행

    /**
     * 참고 *
     * useMemo는 계산이 무거울 때 사용하는 훅
     */
    const groupedData = useMemo(() => {
        return data.reduce((acc, curr) => {
            const { refrigerator_id } = curr;
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


    /**
     * 그래프 그리기
     */
    return (
        <div style={{ width: "100%", margin: 10 }}>
            <h2>실시간 온도 그래프</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "80px" }}>
                {Object.entries(groupedData).map(([refrigerator_id, group]) => (
                    <div key={refrigerator_id} style={{ width: "30%" }}>
                        <h3>{`${group.info.admin_name} ${group.info.refrigerator_number}`}</h3>
                        <ResponsiveContainer width="130%" height={300}>
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
                                <YAxis domain={[-5, 30]} yAxisId="left" />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={[-5, 5]}
                                    // label={{ value: "전류", angle: -90, position: "insideRight" }}
                                />

                                <Tooltip
                                    labelFormatter={(value) =>
                                        new Intl.DateTimeFormat("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }).format(new Date(value)) // 툴팁에서도 동일하게 시간 포맷
                                    }
                                />
                                <Line
                                    type="linear"
                                    dataKey="temperature"
                                    stroke="#8884d8"
                                    dot={false}
                                    name="내부 온도"
                                    yAxisId="left"
                                />
                                <Line
                                    type="linear"
                                    dataKey="out_temperature_value"
                                    stroke="#82ca9d"
                                    dot={false}
                                    name="외부 온도"
                                    yAxisId="left"
                                />
                                <Line
                                    type="linear"
                                    dataKey="current_value"
                                    stroke="#ffc658"
                                    dot={false}
                                    name="전류"
                                    yAxisId="right"
                                />
                                <Line
                                    type="linear"
                                    dataKey="setting_temp_value"
                                    stroke="#000000"
                                    dot={false}
                                    name="설정온도"
                                    yAxisId="left"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemperatureGraph;
