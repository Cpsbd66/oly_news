// src/App.js
import React, { useEffect, useState } from "react";
import { Container, Spinner } from "reactstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import OlympiadTable from "./components/OlympiadTable";

function App() {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "olympiads"));
      const data = snapshot.docs.map((doc) => doc.data());
      setOlympiads(data);
      setLoading(false);
      console.log(data); // Print fetched data to check for 'organization' field
    };
    fetchData();
  }, []);

  return (
    <Container className="mt-5">
      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <OlympiadTable olympiads={olympiads} />
      )}
    </Container>
  );
}

export default App;
