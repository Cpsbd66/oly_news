// src/App.js
import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import OlympiadTable from "./components/OlympiadTable";
import ContactForm from "./components/ContactForm";
import AdminPage from "./components/AdminPage";
import MainNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./styles.css";

export const ThemeContext = createContext();

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default is dark
});

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "olympiads"));
      const data = snapshot.docs.map((doc) => doc.data());
      setOlympiads(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <div className="page-wrapper">
          {!isAdmin && <MainNavbar />}

          <div className="page-content">
            <Routes>
              <Route path="/" element={<OlympiadTable olympiads={olympiads} loading={loading} />} />
              <Route path="/contact/add-event" element={<ContactForm defaultType="Request to Add Event" />} />
              <Route path="/contact/report" element={<ContactForm defaultType="Report Mistakes" />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>

          {!isAdmin && <Footer />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
