// src/components/SubscriptionPopup.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import SubscribeForm from "./SubscribeForm";
import {
  saveSubscriptionDismissed,
  isSubscriptionDismissed,
} from "../utils/localStorageUtils";

const SubscriptionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isSubscriptionDismissed()) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    saveSubscriptionDismissed();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} centered>
      <ModalHeader toggle={handleClose}>Subscribe to Updates</ModalHeader>
      <ModalBody>
        <p className="mb-3">
          Subscribe to monthly updates of events directly to your email.
        </p>
        <SubscribeForm />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Not Now
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SubscriptionPopup;

