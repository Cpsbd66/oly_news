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
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // "success" | "error"

  // Determine placeholder based on defaultType:
  const messagePlaceholder =
    defaultType === "Report Mistakes"
      ? `Mention the event name and then the mistake.`
      : `Name of the event:
Date:
Link:
Organization:
Type (Online / Offline / Both):
Drive link for attachments: `;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE,
        process.env.REACT_APP_EMAILJS_TEMPLATE,
        {
          from_name: form.name,
          reply_to: form.email,
          subject: defaultType,
          message: form.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC
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
      {/* Heading shows the defaultType */}
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
                placeholder="e.g. John Doe"
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
                placeholder="e.g. john@example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder={messagePlaceholder}
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
