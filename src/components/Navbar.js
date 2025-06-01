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
  DropdownItem
} from "reactstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import { ThemeContext } from "../App";

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
          Kytalist
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
      </Container>

      <Collapse isOpen={isOpen} navbar>
        <div className="w-100 d-flex flex-column flex-md-row align-items-center justify-content-between px-3">
          {/* Centered Nav */}
          <Nav className="text-center justify-content-center flex-grow-1" navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle nav caret className="nav-link">
                Contact
              </DropdownToggle>
              <DropdownMenu
                className={`custom-dropdown text-center ${
                  darkMode ? "dropdown-dark" : ""
                }`}
              >
                <DropdownItem tag={RRNavLink} to="/contact/add-event">
                  Add Event
                </DropdownItem>
                <DropdownItem tag={RRNavLink} to="/contact/report">
                  Report Mistake
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>

          {/* Right-aligned Fancy Theme Switch */}
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
