// src/components/OlympiadTable.js
import React, { useState, useMemo, useContext, useEffect } from "react";
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
import { useLocation, NavLink } from "react-router-dom";
import {
  getUserPins,
  toggleUserPin,
  isPinnedLocally,
} from "../utils/localStorageUtils";

const OlympiadTable = ({ olympiads = [], loading }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [localPins, setUserPins] = useState(getUserPins());

  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const allCategories = [
    { name: "National", slug: "national" },
    { name: "Math & Science", slug: "math_science" },
    { name: "Debate", slug: "debate" },
    { name: "Cultural & Language", slug: "cultural_language" },
    { name: "Programming", slug: "programming" },
    { name: "Competitive Programming", slug: "competitive_programming" },
    { name: "Technology", slug: "technology" },
    { name: "Sports", slug: "sports" },
    { name: "Miscellaneous", slug: "miscellaneous" },
  ];

  const today = moment();

  const handleCheckboxChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
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

  // 🔹 Sync localStorage pins
  useEffect(() => {
    const syncPins = () => setUserPins(getUserPins());
    window.addEventListener("storage", syncPins);
    return () => window.removeEventListener("storage", syncPins);
  }, []);

  // 🔹 Prepare pinned list first — includes both admin and local pins
  const allPinned = useMemo(
    () => olympiads.filter((o) => o.adminPinned || isPinnedLocally(o.name)),
    [olympiads, localPins]
  );

  // 🔹 Filtering logic (separates pinning from category rules)
  const filteredOlympiads = useMemo(() => {
    return olympiads.filter((event) => {
      const isEventPinned = allPinned.includes(event);

      // If it's pinned, always show regardless of anything else
      if (isEventPinned) return true;

      // On Home page, hide Competitive Programming (only if not pinned)
      if (
        isHomePage &&
        Array.isArray(event.category) &&
        event.category.includes("Competitive Programming")
      ) {
        return false;
      }

      // Search filter
      const matchesSearch =
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [olympiads, searchTerm, isHomePage, allPinned]);

  // 🔹 Separate pinned/upcoming/concluded
  const pinned = allPinned;

  const upcoming = filteredOlympiads
    .filter(
      (o) =>
        !pinned.includes(o) &&
        (!o.date || moment(o.date, "YYYY-MM-DD").isSameOrAfter(today, "day"))
    )
    .sort((a, b) =>
      moment(a.date || "9999-12-31").diff(moment(b.date || "9999-12-31"))
    );

  const concluded = filteredOlympiads
    .filter(
      (o) =>
        !pinned.includes(o) &&
        o.date &&
        moment(o.date, "YYYY-MM-DD").isBefore(today, "day")
    )
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  const handlePinToggle = (eventName) => {
    toggleUserPin(eventName);
    setUserPins(getUserPins());
  };

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
            <th>Pin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o, i) => (
            <tr key={i}>
              <td>
                {o.date
                  ? moment(o.date, "YYYY-MM-DD").format("DD-MM-YY")
                  : "TBA"}
              </td>
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
              <td>
                {o.adminPinned ? (
                  <span className="text-danger">📌</span>
                ) : (
                  <Button
                    size="sm"
                    color={isPinnedLocally(o.name) ? "warning" : "secondary"}
                    onClick={() => handlePinToggle(o.name)}
                  >
                    {isPinnedLocally(o.name) ? "Unpin" : "Pin"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  return (
    <Container className="mt-5">
      {/* 🔹 Horizontal Event Categories */}
      <Row className="justify-content-center mb-4">
        <Col xs="12" className="d-flex flex-wrap justify-content-center gap-3">
          {allCategories.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/events/${cat.slug}`}
              className="btn btn-outline-primary btn-sm"
              activeclassname="active"
            >
              {cat.name}
            </NavLink>
          ))}
        </Col>
      </Row>

      {/* Search */}
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
      </Row>

      {/* Optional category filters */}
      {showFilters && (
        <Row className="mb-4 justify-content-center">
          <Col xs="12" md="10" className="text-center">
            <strong className="text-primary">Filter by Category:</strong>
            <div className="filter-box d-flex flex-wrap justify-content-center mt-2">
              {allCategories.map((cat) => (
                <FormGroup check inline key={cat.name} className="me-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCheckboxChange(cat.name)}
                    />{" "}
                    {cat.name}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </Col>
        </Row>
      )}

      {/* Tables */}
      <h2 className="text-center mb-4 page-title">Events</h2>
      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <>
          {renderSection(pinned, "📌 Pinned Events", "danger", false)}
          {renderSection(upcoming, "Upcoming Olympiads", "info", false)}
          {renderSection(concluded, "Concluded Olympiads", "secondary", true)}
        </>
      )}
    </Container>
  );
};

export default OlympiadTable;
