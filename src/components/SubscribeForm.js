// src/components/SubscribeForm.js
import React, { useState } from "react";
import { Form, Input, Button, Alert, Label } from "reactstrap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!email) {
      setStatus("error");
      return;
    }

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email.trim(),
        subscribedAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="subscribe-form w-100">
      <h5 className="mb-2 text-center">Get Monthly Event Updates</h5>
      <p className="small mb-3 text-center">
        Enter your email below to receive a monthly summary of upcoming Olympiads
        and related events.
      </p>

      {/* Form container */}
      <Form onSubmit={handleSubmit} className="d-flex justify-content-center flex-wrap">
        {/* Email input */}
        <Label for="subscribeEmail" className="visually-hidden">
          Email
        </Label>
        <Input
          type="email"
          name="subscribeEmail"
          id="subscribeEmail"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-control-sm subscribe-input me-2 mb-2 mb-sm-0"
        />

        {/* Subscribe button */}
        <Button color="primary" size="sm" className="mb-2">
          Subscribe
        </Button>
      </Form>

      {/* Status messages, centered */}
      {status === "success" && (
        <Alert color="success" className="mt-3 py-1 text-center">
          Thank you for subscribing! You’ll receive monthly updates.
        </Alert>
      )}
      {status === "error" && (
        <Alert color="danger" className="mt-3 py-1 text-center">
          Oops! Something went wrong. Please try again.
        </Alert>
      )}
    </div>
  );
};

export default SubscribeForm;
