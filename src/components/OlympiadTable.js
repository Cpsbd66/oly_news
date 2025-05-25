// src/components/OlympiadTable.js
import React from "react";
import { Table, Badge, Container } from "reactstrap";
import moment from "moment";

const OlympiadTable = ({ olympiads = [] }) => {
  console.log(olympiads); // Log data here to ensure it's passed correctly
  
  const today = moment();

  const getCountdown = (dateStr) => {
    const date = moment(dateStr, "YYYY-MM-DD");
    const diff = date.diff(today, "days");
    if (diff > 0) return `${diff} days left`;
    if (diff === 0) return "Happening Today";
    return "Event Concluded";
  };

  // Split & sort
  const upcoming = olympiads
    .filter((o) => moment(o.date, "YYYY-MM-DD").isSameOrAfter(today, "day"))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const concluded = olympiads
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
            <th>Organizer</th>
            <th>Countdown</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o, i) => (
            <tr key={i}>
              <td>{o.date}</td>
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
              <td>{o.organization}</td> {/* This line should display organizer */}
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
      <h2 className="text-center mb-4 page-title">National Olympiad</h2>

      {renderSection(upcoming, "Upcoming Olympiads", "info", false)}

      {renderSection(concluded, "Concluded Olympiads", "secondary", true)}
    </Container>
  );
};

export default OlympiadTable;
