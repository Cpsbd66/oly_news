// src/components/Navbar.js
import React, { useContext, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  NavbarToggler,
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import { ThemeContext } from "../App";

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleContact = () => setContactOpen((prev) => !prev);
  const toggleEvents = () => setEventsOpen((prev) => !prev);

  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <Navbar
      expand="md"
      className={`shadow-sm ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <NavbarBrand tag={RRNavLink} to="/" className="fw-bold d-flex align-items-center">
          <img
            src={darkMode ? "/logo_dark.png" : "/logo_light.png"}
            alt="Kytalist Logo"
            className="navbar-brand-logo"
          />
          <span className="d-flex align-items-center ms-2">
            Kytalist
            <span className="beta-label ms-2">
              <em>βeta</em>
            </span>
          </span>
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
      </Container>

      <Collapse isOpen={isOpen} navbar>
        <div className="w-100 d-flex flex-column flex-md-row align-items-center justify-content-between px-3">
          <Nav className="text-center justify-content-center flex-grow-1" navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>

            {/* Events Dropdown */}
            <Dropdown nav isOpen={eventsOpen} toggle={toggleEvents}>
              <DropdownToggle nav caret className="nav-link">
                Events
              </DropdownToggle>
              <DropdownMenu className={`custom-dropdown text-center ${darkMode ? "dropdown-dark" : ""}`}>
                <DropdownItem tag={RRNavLink} to="/events/national">National</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/math_science">Math & Science</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/debate">Debate</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/cultural_language">Cultural & Language</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/programming">Programming</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/competitive_programming">Competitive Programming</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/technology">Technology</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/sports">Sports</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/events/miscellaneous">Miscellaneous</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Contact Dropdown */}
            <Dropdown nav isOpen={contactOpen} toggle={toggleContact}>
              <DropdownToggle nav caret className="nav-link">
                Contact
              </DropdownToggle>
              <DropdownMenu className={`custom-dropdown text-center ${darkMode ? "dropdown-dark" : ""}`}>
                <DropdownItem tag={RRNavLink} to="/contact/add-event">Add Event</DropdownItem>
                <DropdownItem tag={RRNavLink} to="/contact/report">Report Mistake</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>

          {/* Theme Toggle */}
          <div className="theme-switch-wrapper ms-3 mt-2 mt-md-0">
            <label className="theme-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default MainNavbar;
