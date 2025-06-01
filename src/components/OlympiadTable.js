import React from "react";
import { Table, Badge, Container } from "reactstrap";
import moment from "moment";

const OlympiadTable = ({ olympiads = [] }) => {
  const today = moment();

  const getCountdown = (dateStr) => {
    if (!dateStr) return "Date Pending";
    const date = moment(dateStr, "YYYY-MM-DD");
    const diff = date.diff(today, "days");
    if (diff > 0) return `${diff} days left`;
    if (diff === 0) return "Happening Today";
    return "Event Concluded";
  };

  // Handle events with and without dates
  const withDate = olympiads.filter((o) => o.date);
  const noDate = olympiads.filter((o) => !o.date);

  const upcoming = withDate
    .filter((o) => moment(o.date, "YYYY-MM-DD").isSameOrAfter(today, "day"))
    .sort((a, b) => moment(a.date).diff(moment(b.date)))
    .concat(noDate); // Add no-date events to bottom of upcoming

  const concluded = withDate
    .filter((o) => moment(o.date, "YYYY-MM-DD").isBefore(today, "day"))
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
              <td className={!o.date ? "text-muted fst-italic" : ""}>
                {o.date || "TBA"}
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
              <td>{o.organization}</td>
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
              <td className={!o.date ? "text-muted fst-italic" : isConcluded ? "text-muted" : ""}>
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
      <h2 className="text-center mb-4 page-title">National Events</h2>
      {renderSection(upcoming, "Upcoming Olympiads", "info", false)}
      {renderSection(concluded, "Concluded Olympiads", "secondary", true)}
    </Container>
  );
};

export default OlympiadTable;
