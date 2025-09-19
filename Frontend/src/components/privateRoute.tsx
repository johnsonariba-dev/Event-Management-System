
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();

   useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);

  return <>{children}</>; 
};

export default PrivateRoute;

