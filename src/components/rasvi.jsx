import { useParams, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { getRefrigerator } from "./service/refrigeratorService";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { encryptId } from "../utils/cryptoUtil";

import axios from "axios";

const KioskRedirect = ({
  isAuthenticated,
  userType,
  setIsAuthenticated,
  setUserType,
}) => {
  const { check_refrigerator, refrigerator_number } = useParams();
  const [findRefrigerater, setFindRefrigerator] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  /**
   * 냉장고 조회 api
   */
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

  /**
   * 로그인 api
   */
  useEffect(() => {
    const loginKiosk = async () => {
      try {
        const kioskrequest = { admin_account: check_refrigerator, kiosk: true };
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}:${
            import.meta.env.VITE_SERVER_PORT
          }/api/admin/admin_login`,
          kioskrequest
        );
        const token = response.data.data;
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUserType(decoded.admin_id ? "admin" : "bistech");
      } catch (e) {
        console.error(e);
      }
    };

    if (userType === null) {
      loginKiosk();
    }
  }, [userType]);

  // userType이 null일 때 kiosk 로그인 시도 (useEffect 내에서 처리)
  //   useEffect(() => {
  //     if (userType === null) {
  //       setCheckKiosk(true);
  //     }
  //   }, [userType]);

  // 로딩 중일 때 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (findRefrigerater) {
    return (
      <Navigate to={`/detail/${encryptId(findRefrigerater.refrigerator_id)}`} />
    );
  } else {
    return <div>냉장고 정보를 찾을 수 없습니다.</div>;
  }
};

export default KioskRedirect;
