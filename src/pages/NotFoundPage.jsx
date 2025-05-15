import React from "react";
import { Navigate } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Navigate to="/main"/>
    </div>
  );
};

export default NotFoundPage;
