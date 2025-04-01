import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;
console.log(SOCKET_SERVER_URL)
const TemperatureGraph = () => {
    const [data, setData] = useState([]);

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
            console.log(prevData)
            setData((prevData) => [
                ...prevData,
                {
                    temperature: newTemp.temperature,  // 온도 데이터
                    time: newTemp.createAt || Date.now(), // timestamp가 없으면 현재 시간 사용
                }
            ]);
        });

        return () => {
            console.log("소켓 연결 해제");
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        // console.log(data, "<<<data");
        if (data.length > 0) {
            const temperatures = data.map((d) => d.temperature);
            const minTemp = Math.min(...temperatures);
            const maxTemp = Math.max(...temperatures);
            console.log(`Y축 범위: 최소 ${minTemp}, 최대 ${maxTemp}`);
        }
    }, [data]); // data가 변경될 때마다 실행

    return (
        <div style={{ width: "80%", height: 400, margin: "auto" }}>
            <h2>실시간 온도 그래프</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
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
                    />                    <Line type="linear" dataKey="temperature" stroke="#8884d8" dot={true} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureGraph;
