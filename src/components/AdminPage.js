// src/pages/AdminPage.js
import React, { useEffect, useState } from "react";
import {
  Container, Table, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from "reactstrap";
import { getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AddEventForm from "../components/AddEventForm";

const AdminPage = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const fetchOlympiads = async () => {
    const snapshot = await getDocs(collection(db, "olympiads"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOlympiads(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "olympiads", id));
    fetchOlympiads();
  };

  const handleEditClick = (event) => {
    setCurrentEvent(event);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    const docRef = doc(db, "olympiads", currentEvent.id);
    const { id, ...eventData } = currentEvent;
    await updateDoc(docRef, eventData);
    setEditModal(false);
    fetchOlympiads();
  };

  useEffect(() => {
    fetchOlympiads();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Admin Panel</h2>
      <AddEventForm onAdd={fetchOlympiads} />

      <Table responsive hover className="mt-4">
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
          {olympiads.map((event) => (
            <tr key={event.id}>
              <td>{event.date}</td>
              <td>{event.name}</td>
              <td>{event.organization}</td>
              <td>
                <a href={event.link} target="_blank" rel="noopener noreferrer">Link</a>
              </td>
              <td>
                <Button color="warning" size="sm" onClick={() => handleEditClick(event)}>Edit</Button>{" "}
                <Button color="danger" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Olympiad</ModalHeader>
        <ModalBody>
          {currentEvent && (
            <Form>
              <FormGroup>
                <Label for="editName">Name</Label>
                <Input
                  id="editName"
                  value={currentEvent.name}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="editDate">Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="editOrganization">Organization</Label>
                <Input
                  id="editOrganization"
                  value={currentEvent.organization}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, organization: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="editLink">Link</Label>
                <Input
                  id="editLink"
                  value={currentEvent.link}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, link: e.target.value })}
                />
              </FormGroup>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSubmit}>Save Changes</Button>{" "}
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminPage;
