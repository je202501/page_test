import React from 'react';
import Detail from '../components/Detail';
import { useParams } from 'react-router-dom';
import { decryptId, encryptId } from "../utils/cryptoUtil";
import { Navigate } from 'react-router-dom';

const DetailPage = () => {
  const { encId } = useParams();
  const decryptedId = decryptId(encId);
  if (!decryptedId || isNaN(decryptedId)) {
    return <Navigate to="/main" />
  }
  return (
    <div className="detail-page">
      {' '}
      {/* 중앙 정렬을 위한 컨테이너 */}
      <Detail refrigerator_id={decryptedId} />
    </div>
  );
};

export default DetailPage;
