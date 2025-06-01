import React from "react";
import { NavLink } from "react-router-dom";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <footer className="py-4 mt-5">
      <div className="container">
        {/* Only one SubscribeForm here */}
        <div className="mb-4">
          <SubscribeForm />
        </div>

        {/* Navigation Links */}
        <div className="mb-2 text-center">
          <NavLink to="/" className="me-3">
            Home
          </NavLink>
          <NavLink to="/contact/add-event" className="me-3">
            Add Event
          </NavLink>
          <NavLink to="/contact/report">Report Mistake</NavLink>
        </div>

        {/* Copyright */}
        <div className="text-center text-muted" style={{ fontSize: "0.875rem" }}>
          © Kytalist.com
        </div>
      </div>
    </footer>
  );
};

export default Footer;
