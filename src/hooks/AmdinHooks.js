import { getAdmin as fetchAdmin } from '../components/service/adminService';
import { useQuery } from '@tanstack/react-query';
export const useGetAdmin = () => {
  const data = useQuery({
    queryKey: ['admin'],
    queryFn: () => fetchAdmin(),
  });
  return data;
};
