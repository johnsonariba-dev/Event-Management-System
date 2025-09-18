
import React, { useEffect } from "react";
<<<<<<< Updated upstream
<<<<<<< HEAD
import { Navigate, useNavigate } from "react-router-dom";
=======
import {  useNavigate } from "react-router-dom";
>>>>>>> b0ff3c1 (new install)
=======
import {  useNavigate } from "react-router-dom";
>>>>>>> Stashed changes

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

