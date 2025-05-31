// src/components/ContactForm.js
import React, { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Row,
  Col,
} from "reactstrap";
import emailjs from "@emailjs/browser";

const ContactForm = ({ defaultType }) => {
  // Initialize the form with no “type” field the user can change:
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // "success" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_2yxx88j",           // your service ID
        "template_hxjkx8y",          // your template ID
        {
          from_name: form.name,
          reply_to: form.email,
          subject: defaultType,      // use the prop here
          message: form.message,
        },
        "kcME17fN5qPQ7lXLF"          // your public key
      )
      .then(
        () => {
          setStatus("success");
          setForm({ name: "", email: "", message: "" });
        },
        () => {
          setStatus("error");
        }
      );
  };

  return (
    <Container className="mt-5">
      {/* Use defaultType as the heading */}
      <h2 className="mb-4 text-center">{defaultType}</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          {status === "success" && (
            <Alert color="success">Message sent successfully!</Alert>
          )}
          {status === "error" && (
            <Alert color="danger">Failed to send message.</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Your Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Your Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Send {defaultType}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactForm;
