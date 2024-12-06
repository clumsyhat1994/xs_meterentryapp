import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

import ReadingReportForm from './ReadingReportForm';
import AuthenticationPage from './AuthenticationPage';
import ProtectedRoute from './ProtectedRoute';
const App = ()=> {
  <Router>
    <Routes>
      <Route path='/authentication' element={<AuthenticationPage/>}/>
      <Route path='/meter-reading' element={<ProtectedRoute><ReadingReportForm/></ProtectedRoute>}/>
      <Route path = '*' element={<Navigate to='/meter-reading'/>}/>
    </Routes>
  </Router>
};

export default App;
