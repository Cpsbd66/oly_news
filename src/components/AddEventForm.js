// src/components/AddEventForm.js
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddEventForm = ({ onAdd }) => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    link: "",
    organization: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "olympiads"), eventData);
    setEventData({ name: "", date: "", link: "", organization: "" });
    if (onAdd) onAdd();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="name">Olympiad Name</Label>
        <Input
          id="name"
          name="name"
          value={eventData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="link">Link</Label>
        <Input
          id="link"
          name="link"
          value={eventData.link}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="organization">Organization</Label>
        <Input
          id="organization"
          name="organization"
          value={eventData.organization}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <Button type="submit" color="primary">Add Olympiad</Button>
    </Form>
  );
};

export default AddEventForm;
