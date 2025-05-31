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
  Button,
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
    <Navbar expand="md" className={`shadow-sm ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <Container className="d-flex justify-content-between align-items-center">
        <NavbarBrand tag={RRNavLink} to="/" className="fw-bold d-flex align-items-center">
          <img
            src="../logo.png"
            className="navbar-brand-logo"
          />
          Kytalist
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle nav caret>
                Contact
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={RRNavLink} to="/contact/add-event">
                  Add Event
                </DropdownItem>
                <DropdownItem tag={RRNavLink} to="/contact/report">
                  Report Mistake
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavItem className="ms-3">
              <Button color={darkMode ? "secondary" : "dark"} size="sm" onClick={toggleTheme}>
                {darkMode ? "☀ Light" : "🌙 Dark"}
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
