import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute =(children, ...rest)=>{
    const token = localStorage.getItem('authToken');
    return token? children : <Navigate to='/Authentication'/>;
};

export default ProtectedRoute;