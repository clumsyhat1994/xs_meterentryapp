import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";

import ReadingReportForm from "./ReadingReportForm";
import AuthenticationPage from "./AuthenticationPage";
import ProtectedRoute from "./ProtectedRoute";
import { Scanner } from "./Scanner";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/login" element={<AuthenticationPage />} />
        <Route
          path="/meter-reading/:id"
          element={
            <ProtectedRoute>
              <ReadingReportForm />
            </ProtectedRoute>
          }
        />
        <Route path="/meter-reading-test/:id" element={<ReadingReportForm />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
export default App;
