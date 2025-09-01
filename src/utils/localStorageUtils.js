// src/utils/localStorageUtils.js

// ------------------ Pins ------------------
const LOCAL_PIN_KEY = "userPinnedEvents";

export const getUserPins = () => {
  const raw = localStorage.getItem(LOCAL_PIN_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const toggleUserPin = (eventId) => {
  const current = getUserPins();
  let updated;
  if (current.includes(eventId)) {
    updated = current.filter((id) => id !== eventId);
  } else {
    updated = [...current, eventId];
  }
  localStorage.setItem(LOCAL_PIN_KEY, JSON.stringify(updated));
  return updated;
};

export const isPinnedLocally = (eventId) => {
  return getUserPins().includes(eventId);
};

// ------------------ Subscription ------------------
const SUBSCRIPTION_KEY = "subscriptionDismissed";

export const saveSubscriptionDismissed = () => {
  localStorage.setItem(SUBSCRIPTION_KEY, "true");
};

export const isSubscriptionDismissed = () => {
  return localStorage.getItem(SUBSCRIPTION_KEY) === "true";
};

