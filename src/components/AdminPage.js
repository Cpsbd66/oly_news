import React, { useState, useEffect } from "react";
import {
  Container, Form, FormGroup, Label, Input, Button, Table
} from "reactstrap";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection, addDoc, getDocs, query, where, deleteDoc, doc
} from "firebase/firestore";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [olympiads, setOlympiads] = useState([]);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [form, setForm] = useState({ date: "", name: "", organization: "", link: "" });

  useEffect(() => {
    const fetchOlympiads = async () => {
      const snapshot = await getDocs(collection(db, "olympiads"));
      const olympiadData = snapshot.docs.map(doc => doc.data());
      setOlympiads(olympiadData);
    };

    fetchOlympiads();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
      setUser(res.user);
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, "olympiads"), where("name", "==", form.name));
      const existing = await getDocs(q);
      existing.forEach(d => deleteDoc(doc(db, "olympiads", d.id)));

      await addDoc(collection(db, "olympiads"), form);
      alert("Uploaded successfully");
      setForm({ date: "", name: "", organization: "", link: "" });
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleDelete = async (name) => {
    try {
      const q = query(collection(db, "olympiads"), where("name", "==", name));
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref);  // Deletes the document by reference
      });
      alert("Event deleted successfully");
      setOlympiads(olympiads.filter((event) => event.name !== name));  // Update the UI
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <h4>Admin Login</h4>
        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              value={loginInfo.email}
              onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={loginInfo.password}
              onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
            />
          </FormGroup>
          <Button color="primary">Login</Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h4>Olympiad Data</h4>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Organization</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {olympiads.map((event, index) => (
            <tr key={index}>
              <td>{event.date}</td>
              <td>{event.name}</td>
              <td>{event.organization}</td> {/* Updated to use "organization" */}
              <td>
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>
                <Button color="danger" onClick={() => handleDelete(event.name)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mb-3">Upload Olympiad</h4>
      <Form onSubmit={handleUpload}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Organization</Label>
          <Input
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Link</Label>
          <Input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            required
          />
        </FormGroup>
        <Button color="success">Upload</Button>
        <Button color="danger" className="ms-2" onClick={logout}>
          Logout
        </Button>
      </Form>
    </Container>
  );
};

export default AdminPage;
