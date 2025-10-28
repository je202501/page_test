import React, { useState, useEffect } from "react";

//업체 selector
const DropdownSelectorAdmin = ({ onSelectAdmin }) => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  //업체 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    fetch(`${import.meta.env.VITE_SERVER_URL}:51766/api/admin/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAdmins(data.data);
        }
      })
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);

  const handleAdminChange = (e) => {
    const adminId = Number(e.target.value);
    setSelectedAdminId(adminId);
    onSelectAdmin(adminId); // 선택한 admin_id를 상위 컴포넌트로 전달
  };

  return (
    <div>
      <select onChange={handleAdminChange} value={selectedAdminId || ""}>
        <option value="">업체 선택</option>
        {admins.map((admin) => (
          <option key={admin.admin_id} value={admin.admin_id}>
            {admin.admin_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelectorAdmin;
