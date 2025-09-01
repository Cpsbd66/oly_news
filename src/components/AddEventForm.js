// src/components/AddEventForm.js
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Container } from "reactstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

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

const AddEventForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    date: "",
    name: "",
    organization: "",
    link: "",
    type: "",
    category: [],        // store as array
    adminPinned: false,  // 🔴 global pin flag
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Normalize payload
      const payload = {
        ...form,
        name: form.name.trim(),
        organization: form.organization.trim(),
        link: form.link.trim(),
        // ensure array
        category: Array.isArray(form.category) ? form.category : [],
        // optional fields if empty
        type: form.type || "",
      };

      await addDoc(collection(db, "olympiads"), payload);
      alert("Event added!");

      // reset form
      setForm({
        date: "",
        name: "",
        organization: "",
        link: "",
        type: "",
        category: [],
        adminPinned: false,
      });

      onAdd && onAdd(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Error adding event.");
    }
  };

  const toggleCategory = (cat) => {
    const current = Array.isArray(form.category) ? form.category : [];
    if (current.includes(cat)) {
      setForm({ ...form, category: current.filter((c) => c !== cat) });
    } else {
      setForm({ ...form, category: [...current, cat] });
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
          >
            <option value="">Select Type</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Online & Offline</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>Categories</Label>
          <div className="d-flex flex-wrap">
            {CATEGORIES.map((cat) => (
              <FormGroup check inline key={cat} className="me-3 mb-2">
                <Label check>
                  <Input
                    type="checkbox"
                    checked={Array.isArray(form.category) && form.category.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />{" "}
                  {cat}
                </Label>
              </FormGroup>
            ))}
          </div>
        </FormGroup>

        <FormGroup check className="mb-3">
          <Label check>
            <Input
              type="checkbox"
              checked={form.adminPinned}
              onChange={(e) =>
                setForm({ ...form, adminPinned: e.target.checked })
              }
            />{" "}
            Pin this event globally
          </Label>
        </FormGroup>

        <Button color="success" type="submit">
          Add Event
        </Button>
      </Form>
    </Container>
  );
};

export default AddEventForm;

