// src/App.js
import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import OlympiadTable from "./components/OlympiadTable";
import ContactForm from "./components/ContactForm";
import MainNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPage from "./components/AdminPage";

export const ThemeContext = createContext();

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Update body class dynamically
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {!isAdmin && <MainNavbar />}
      <Routes>
        <Route path="/" element={<OlympiadTable />} />
        <Route path="/contact/add-event" element={<ContactForm defaultType="Request to Add Event" />} />
        <Route path="/contact/report" element={<ContactForm defaultType="Report Mistakes" />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </ThemeContext.Provider>
  );
}

export default App;
