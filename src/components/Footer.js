// src/components/Footer.js
import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center mt-4 py-3">
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/contact/add-event">Add Event</NavLink>
        <NavLink to="/contact/report">Report Mistake</NavLink>
      </div>
      <div className="mt-2 text-muted">© 2025 Olympiad Portal</div>
    </footer>
  );
};

export default Footer;
