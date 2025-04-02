import React, { useState, useEffect } from 'react';

const DropdownSelector = ({ onSelectRefrigerator }) => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedRefrigeratorId, setSelectedRefrigeratorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    fetch(`${import.meta.env.VITE_SERVER_URL}:9999/api/admin/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAdmins(data.data);
        }
      })
      .catch((error) => console.error('Error fetching admins:', error));
  }, []);

  const selectedAdmin = admins.find(
    (admin) => admin.admin_id === selectedAdminId
  );

  const refrigerators = selectedAdmin
    ? selectedAdmin.Refrigerators.sort((a, b) => {
        const getSortValue = (str) =>
          str
            .match(/(\d+)-(\d+)/)
            ?.slice(1)
            .map(Number) || [Infinity, Infinity];
        const [a1, a2] = getSortValue(a.refrigerator_number);
        const [b1, b2] = getSortValue(b.refrigerator_number);
        return a1 - b1 || a2 - b2;
      })
    : [];

  const handleRefrigeratorChange = (e) => {
    const fridgeId = Number(e.target.value);
    setSelectedRefrigeratorId(fridgeId);
    onSelectRefrigerator(fridgeId); // 선택한 refrigerator_id 상위 컴포넌트로 전달
  };

  return (
    <div>
      <label>관리자 선택:</label>
      <select onChange={(e) => setSelectedAdminId(Number(e.target.value))}>
        <option value="">관리자 선택</option>
        {admins.map((admin) => (
          <option key={admin.admin_id} value={admin.admin_id}>
            {admin.admin_name}
          </option>
        ))}
      </select>

      {selectedAdminId && (
        <>
          <label>냉장고 선택:</label>
          <select onChange={handleRefrigeratorChange}>
            <option value="">냉장고 선택</option>
            {refrigerators.map((fridge) => (
              <option
                key={fridge.refrigerator_id}
                value={fridge.refrigerator_id}
              >
                {fridge.refrigerator_number}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default DropdownSelector;
