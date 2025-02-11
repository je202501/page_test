import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResidentList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios
        .get('http://localhost:9999/api/resident')
        .then((res) => {
          console.log(`상주:${res.data.data}`);
          const formattedData = res.data.data.map((item) => ({
            resident_id: item.resident_id,
            resident_name: item.resident_name,
            primary_resident: item.primary_resident,
            refrigerator_id: item.refrigerator_id,
          }));
          setResidents(formattedData);
        })
        .catch((res) => {
          console.log('실패', res.data.message);
        });
    } finally {
      setLoading(false);
    }
  };

  return residents;
}
