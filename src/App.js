import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import OlympiadTable from "./components/OlympiadTable";
import ContactForm from "./components/ContactForm";
import AdminPage from "./components/AdminPage";
import MainNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const ThemeContext = createContext();

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);
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
      {!isAdmin && <MainNavbar />}
      <Routes>
        <Route
          path="/"
          element={<OlympiadTable olympiads={olympiads} loading={loading} />}
        />
        <Route
          path="/contact/add-event"
          element={<ContactForm defaultType="Request to Add Event" />}
        />
        <Route
          path="/contact/report"
          element={<ContactForm defaultType="Report Mistakes" />}
        />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </ThemeContext.Provider>
  );
}

export default App;
