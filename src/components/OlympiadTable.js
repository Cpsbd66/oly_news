// src/components/OlympiadTable.js
import React, { useState } from "react";
import {
  Table,
  Badge,
  Container,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button
} from "reactstrap";
import moment from "moment";

const OlympiadTable = ({ olympiads = [], loading }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const today = moment();
  const allCategories = [
    "National",
    "Math & Science",
    "Debate",
    "Cultural & Language",
    "Programming",
    "Technology",
    "Sports",
    "Miscellaneous"
  ];

  const handleCheckboxChange = (value, list, setter) => {
    setter((prev) =>
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

  const filteredOlympiads = olympiads.filter((event) => {
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

  const upcoming = filteredOlympiads
    .filter(
      (o) =>
        !o.date || moment(o.date, "YYYY-MM-DD").isSameOrAfter(today, "day")
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
      <Row className="align-items-stretch mb-3 gx-2 flex-wrap">
        <Col xs="9" sm="10">
          <div className="d-flex h-100">
            <Input
              type="search"
              className="form-control search-input"
              placeholder="Search by name or organization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
        <Col xs="3" sm="2">
          <div className="d-flex h-100">
            <Button
              className="filter-toggle-btn w-100 text-filter"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              {showFilters ? "Hide" : "Filter"}
            </Button>

          </div>
        </Col>
      </Row>


      {showFilters && (
        <Row className="mb-4">
          <Col xs="12">
            <strong className="filter-label">Filter by Category:</strong>
            <div className="filter-box mt-2">
              {allCategories.map((cat) => (
                <FormGroup check inline key={cat} className="me-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() =>
                        handleCheckboxChange(
                          cat,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                    />{" "}
                    {cat}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </Col>
        </Row>
      )}

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
