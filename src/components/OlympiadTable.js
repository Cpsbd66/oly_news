// src/components/OlympiadTable.js
import React, { useState, useMemo, useContext } from "react";
import {
  Table,
  Badge,
  Container,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
import moment from "moment";
import { ThemeContext } from "../App";
import { useLocation } from "react-router-dom";

const OlympiadTable = ({ olympiads = [], loading }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const allCategories = [
    "National",
    "Math & Science",
    "Debate",
    "Cultural & Language",
    "Programming",
    "Technology",
    "Sports",
    "Miscellaneous",
  ];

  const today = moment();

  const handleCheckboxChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const getCountdown = (dateStr) => {
    if (!dateStr) return "Date Pending";

    const todayLocal = moment().utcOffset(6).startOf("day");
    const eventDate = moment(dateStr, "YYYY-MM-DD").utcOffset(6).startOf("day");

    const diff = eventDate.diff(todayLocal, "days");
    if (diff > 0) return `${diff} days left`;
    if (diff === 0) return "Happening Today";
    return "Event Concluded";
  };

  const filteredOlympiads = useMemo(() => {
    return olympiads.filter((event) => {
      // Skip Competitive Programming on homepage
      if (
        isHomePage &&
        Array.isArray(event.category) &&
        event.category.includes("Competitive Programming")
      ) {
        return false;
      }

      const matchesSearch =
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        (Array.isArray(event.category)
          ? event.category.some((cat) => selectedCategories.includes(cat))
          : selectedCategories.includes(event.category));

      return matchesSearch && matchesCategory;
    });
  }, [olympiads, searchTerm, selectedCategories, isHomePage]);

  const upcoming = filteredOlympiads
    .filter(
      (o) => !o.date || moment(o.date, "YYYY-MM-DD").isSameOrAfter(today, "day")
    )
    .sort((a, b) =>
      moment(a.date || "9999-12-31").diff(moment(b.date || "9999-12-31"))
    );

  const concluded = filteredOlympiads
    .filter((o) => o.date && moment(o.date, "YYYY-MM-DD").isBefore(today, "day"))
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  const renderSection = (data, title, badgeColor, isConcluded) => (
    <>
      <h4 className="d-flex align-items-center mt-4">
        {title}{" "}
        <Badge color={badgeColor} pill className="ms-2">
          {data.length}
        </Badge>
      </h4>
      <Table hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Organization</th>
            <th>Type</th>
            <th>Countdown</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o, i) => (
            <tr key={i}>
              <td>{o.date || "TBA"}</td>
              <td>
                <a
                  href={o.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="olymp-link"
                >
                  {o.name}
                </a>
              </td>
              <td>{o.organization || "—"}</td>
              <td>
                {o.type ? (
                  <span
                    className={`badge ${
                      o.type === "Online"
                        ? "bg-info"
                        : o.type === "Offline"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {o.type}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className={isConcluded ? "text-muted" : ""}>
                {getCountdown(o.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  return (
    <Container className="mt-5">
      {/* Search + Filter toggle */}
      <Row className="align-items-center justify-content-center mb-3 g-2">
        <Col xs={9} sm={10} md={6}>
          <Input
            type="search"
            className="form-control search-input"
            placeholder="Search by name or organization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button
            className="filter-toggle-btn text-filter px-4"
            color={darkMode ? "dark" : "secondary"}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide" : "Filter"}
          </Button>
        </Col>
      </Row>

      {/* Category Filters */}
      {showFilters && (
        <Row className="mb-4 justify-content-center">
          <Col xs="12" md="10" className="text-center">
            <strong className="text-primary">Filter by Category:</strong>
            <div className="filter-box d-flex flex-wrap justify-content-center mt-2">
              {allCategories.map((cat) => (
                <FormGroup check inline key={cat} className="me-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCheckboxChange(cat)}
                    />{" "}
                    {cat}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </Col>
        </Row>
      )}

      {/* Table */}
      <h2 className="text-center mb-4 page-title">Events</h2>
      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <>
          {renderSection(upcoming, "Upcoming Olympiads", "info", false)}
          {renderSection(concluded, "Concluded Olympiads", "secondary", true)}
        </>
      )}
    </Container>
  );
};

export default OlympiadTable;

