import React, { useEffect, useState } from "react";
import { Table, Badge, Container, Spinner } from "reactstrap";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import moment from "moment";

const OlympiadTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = moment();

  const getCountdown = (dateStr) => {
    const date = moment(dateStr, "YYYY-MM-DD");
    const diff = date.diff(today, "days");
    if (diff > 0) return `${diff} days left`;
    if (diff === 0) return "Happening Today";
    return "Event Concluded";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "olympiads"));
        const data = snapshot.docs.map((doc) => doc.data());
        setOlympiads(data);
      } catch (err) {
        console.error("Failed to load olympiads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <td>{o.organization || "—"}</td>
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
      <h2 className="text-center mb-4 page-title">National Events</h2>

      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
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
