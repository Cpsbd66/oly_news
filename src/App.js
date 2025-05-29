// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, Spinner, Alert } from "reactstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import OlympiadTable from "./components/OlympiadTable";
import MessageForm from "./components/MessageForm";
// Import Analytics:
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "olympiads"));
      setOlympiads(snap.docs.map(d => d.data()));
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Container className="mt-5">
              {loading ? (
                <Spinner color="primary" className="d-block mx-auto" />
              ) : (
                <>
                  <OlympiadTable olympiads={olympiads} />
                  <Alert color="info" className="mt-4 text-center">
                    Have feedback? <Link to="/contact">Contact us!</Link>
                  </Alert>
                </>
              )}
            </Container>
          }
        />
        <Route path="/contact" element={<MessageForm />} />
      </Routes>

      <Analytics />
    </>
  );
}

export default App;
