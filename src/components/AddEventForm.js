// src/components/AddEventForm.js
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Container } from "reactstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddEventForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    date: "",
    name: "",
    organization: "",
    link: "",
    type: "", 
    category: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "olympiads"), form);
      alert("Event added!");
      setForm({
        date: "",
        name: "",
        organization: "",
        link: "",
        type: "",
      });
      onAdd(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Error adding event.");
    }
  };

  return (
    <Container className="mb-4">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="organization">Organization</Label>
          <Input
            id="organization"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="link">Link</Label>
          <Input
            id="link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="type">Type</Label>
          <Input
            id="type"
            type="select"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Online & Offline</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="category">Categories</Label>
          <div className="d-flex flex-wrap">
            {[
              "National",
              "Math & Science",
              "Debate",
              "Cultural & Language",
              "Programming", 
              "Competitive Programming",
              "Technology",
              "Sports",
              "Miscellaneous",
            ].map((cat) => (
              <FormGroup check inline key={cat} className="me-3 mb-2">
                <Label check>
                  <Input
                    type="checkbox"
                    checked={form.category?.includes(cat)}
                    onChange={() => {
                      const existing = form.category || [];
                      if (existing.includes(cat)) {
                        setForm({
                          ...form,
                          category: existing.filter((c) => c !== cat),
                        });
                      } else {
                        setForm({
                          ...form,
                          category: [...existing, cat],
                        });
                      }
                    }}
                  />{" "}
                  {cat}
                </Label>
              </FormGroup>
            ))}
          </div>
        </FormGroup>


        <Button color="success" type="submit">
          Add Event
        </Button>
      </Form>
    </Container>
  );
};

export default AddEventForm;
