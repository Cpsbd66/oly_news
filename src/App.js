// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, Spinner, Alert } from "reactstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import OlympiadTable from "./components/OlympiadTable";
import MessageForm from "./components/MessageForm";

function App() {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(collection(db, "olympiads"));
      setOlympiads(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    })();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container className="mt-5">
            {loading ? (
              <div className="text-center">
                <Spinner color="primary" />
              </div>
            ) : (
              <>
                <OlympiadTable olympiads={olympiads} />
                <Alert color="info" className="mt-4 text-center">
                  Have feedback or want to request an event?{" "}
                  <Link to="/contact">Send us a message!</Link>
                </Alert>
              </>
            )}
          </Container>
        }
      />
      <Route path="/contact" element={<MessageForm />} />
    </Routes>
  );
}

export default App;
