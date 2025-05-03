import { useParams, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { getRefrigerator } from "./service/refrigeratorService";
import { useEffect, useState } from "react";

const KioskRedirect = ({ isAuthenticated, userType, setIsAuthenticated, setUserType }) => {
    const { check_refrigerator, refrigerator_number } = useParams();
    const [findRefrigerater, setFindRefrigerator] = useState(null);
    useEffect(() => {
        const fetchRefrigerator = async () => {
            try {
                const res = await getRefrigerator(check_refrigerator);
                const match = res.data.find(
                    (item) => item.refrigerator_number === refrigerator_number
                );
                setFindRefrigerator(match || null);
            } catch (err) {
                setFindRefrigerator(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRefrigerator();
    }, [check_refrigerator, refrigerator_number]);


    // 아직 로딩 중일 때 아무것도 리턴하지 않음
    if (userType === null) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
        return <LoginPage setAuth={setIsAuthenticated} setUserType={setUserType} />;
    }

    if (userType === "admin") {
        if (findRefrigerater) {
            return <Navigate to={`/detail/${findRefrigerater.refrigerator_id}`} />;
        } else {
            return <div>냉장고 정보를 찾을 수 없습니다.</div>;
        }
    } else {
        return <Navigate to="/bistechmain" />;
    }
};

export default KioskRedirect;
