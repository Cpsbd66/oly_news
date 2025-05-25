// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import App from "./App";
import AdminPage from "./components/AdminPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Public table at “/” */}
      <Route path="/" element={<App />} />

      {/* Admin form at “/admin” */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);
