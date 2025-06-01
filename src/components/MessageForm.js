import React, { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Alert,
} from "reactstrap";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";


const MessageForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "Request to Add Event",
    message: "",
  });
  const [status, setStatus] = useState(null); // success | error

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
        setForm({
          name: "",
          email: "",
          type: "Request to Add Event",
          message: "",
        });

        // ⏳ Redirect to homepage after 5 seconds
        setTimeout(() => {
          navigate("/");
        }, 5000);
      },
      () => {
        setStatus("error");
      }
    );
};

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Contact Us</h2>
      <Row className="justify-content-center">
        <Col md={8}>
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
              <Label for="type">Message Type</Label>
              <Input
                type="select"
                name="type"
                id="type"
                value={form.type}
                onChange={handleChange}
              >
                <option>Request to Add Event</option>
                <option>Report Mistakes</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Send Message
            </Button>

            {status === "success" && (
              <Alert color="success" className="mt-3">
                Message sent successfully!
              </Alert>
            )}
            {status === "error" && (
              <Alert color="danger" className="mt-3">
                Failed to send message. Please try again later.
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MessageForm;
