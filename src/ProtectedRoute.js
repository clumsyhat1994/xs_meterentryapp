import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const checkTokenValidity = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    console.log("decoded: ", decoded);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    console.error("Invalid token", e);
    return false;
  }
};

const ProtectedRoute = ({ children, ...rest }) => {
  return checkTokenValidity() ? children : <Navigate to="/Authentication" />;
};

export default ProtectedRoute;
