// src/components/AdminPage.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "../firebase";
import AddEventForm from "../components/AddEventForm";

const CATEGORIES = [
  "National",
  "Math & Science",
  "Debate",
  "Cultural & Language",
  "Programming",
  "Competitive Programming",
  "Technology",
  "Sports",
  "Miscellaneous",
];

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [olympiads, setOlympiads] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const fetchOlympiads = async () => {
    const snapshot = await getDocs(collection(db, "olympiads"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setOlympiads(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
      setUser(res.user);
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "olympiads", id));
    fetchOlympiads();
  };

  const handleEditClick = (event) => {
    // Normalize category to array
    const normalized = {
      ...event,
      category: Array.isArray(event.category) ? event.category : [],
      adminPinned: !!event.adminPinned,
    };
    setCurrentEvent(normalized);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!currentEvent) return;
    const docRef = doc(db, "olympiads", currentEvent.id);
    const { id, ...eventData } = currentEvent;
    // Ensure clean data
    const payload = {
      ...eventData,
      category: Array.isArray(eventData.category) ? eventData.category : [],
      adminPinned: !!eventData.adminPinned,
    };
    await updateDoc(docRef, payload);
    setEditModal(false);
    fetchOlympiads();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchOlympiads();
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container fluid className="py-4 px-3">
      {!user ? (
        <Form onSubmit={handleLogin}>
          <h4 className="mb-3">Admin Login</h4>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={loginInfo.email}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={loginInfo.password}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, password: e.target.value })
              }
              required
            />
          </FormGroup>
          <Button color="primary">Login</Button>
        </Form>
      ) : (
        <>
          <h2 className="mb-4 text-center">Admin Panel</h2>
          <AddEventForm onAdd={fetchOlympiads} />
          <Button color="danger" className="mb-3" onClick={logout}>
            Logout
          </Button>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Organization</th>
                <th>Link</th>
                <th>Type</th>
                <th>Category</th>
                <th>Pinned</th>{/* 🔴 show pin status */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {olympiads.map((event) => (
                <tr key={event.id}>
                  <td>{event.date || "—"}</td>
                  <td>{event.name}</td>
                  <td>{event.organization}</td>
                  <td>
                    {event.link ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{event.type || "—"}</td>
                  <td>
                    {Array.isArray(event.category) && event.category.length > 0
                      ? event.category.join(", ")
                      : "—"}
                  </td>
                  <td>{event.adminPinned ? <span className="text-danger">📌</span> : "—"}</td>
                  <td>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleEditClick(event)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${event.name}"?`
                          )
                        ) {
                          handleDelete(event.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              Edit Olympiad
            </ModalHeader>
            <ModalBody>
              {currentEvent && (
                <Form>
                  <FormGroup>
                    <Label for="editName">Name</Label>
                    <Input
                      id="editName"
                      value={currentEvent.name || ""}
                      onChange={(e) =>
                        setCurrentEvent({
                          ...currentEvent,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="editDate">Date</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={currentEvent.date || ""}
                      onChange={(e) =>
                        setCurrentEvent({
                          ...currentEvent,
                          date: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="editOrganization">Organization</Label>
                    <Input
                      id="editOrganization"
                      value={currentEvent.organization || ""}
                      onChange={(e) =>
                        setCurrentEvent({
                          ...currentEvent,
                          organization: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="editLink">Link</Label>
                    <Input
                      id="editLink"
                      value={currentEvent.link || ""}
                      onChange={(e) =>
                        setCurrentEvent({
                          ...currentEvent,
                          link: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="editType">Type</Label>
                    <Input
                      id="editType"
                      type="select"
                      value={currentEvent.type || ""}
                      onChange={(e) =>
                        setCurrentEvent({
                          ...currentEvent,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Type</option>
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Online & Offline</option>
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label>Category</Label>
                    <div className="d-flex flex-wrap">
                      {CATEGORIES.map((cat) => {
                        const checked =
                          Array.isArray(currentEvent.category) &&
                          currentEvent.category.includes(cat);
                        return (
                          <FormGroup check inline key={cat} className="me-3 mb-2">
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const arr = Array.isArray(currentEvent.category)
                                    ? [...currentEvent.category]
                                    : [];
                                  if (e.target.checked) {
                                    if (!arr.includes(cat)) arr.push(cat);
                                  } else {
                                    const idx = arr.indexOf(cat);
                                    if (idx > -1) arr.splice(idx, 1);
                                  }
                                  setCurrentEvent({
                                    ...currentEvent,
                                    category: arr,
                                  });
                                }}
                              />{" "}
                              {cat}
                            </Label>
                          </FormGroup>
                        );
                      })}
                    </div>
                  </FormGroup>

                  <FormGroup check className="mb-0">
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={!!currentEvent.adminPinned}
                        onChange={(e) =>
                          setCurrentEvent({
                            ...currentEvent,
                            adminPinned: e.target.checked,
                          })
                        }
                      />{" "}
                      Globally Pin this event
                    </Label>
                  </FormGroup>
                </Form>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditSubmit}>
                Save Changes
              </Button>{" "}
              <Button color="secondary" onClick={() => setEditModal(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default AdminPage;

