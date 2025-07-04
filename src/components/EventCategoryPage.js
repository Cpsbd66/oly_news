// src/components/EventCategoryPage.js
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Badge } from "reactstrap";
import OlympiadTable from "./OlympiadTable";
import { getCategoryNameFromSlug } from "../utils/categoryMap";

const EventCategoryPage = ({ olympiads = [], loading }) => {
  const { slug } = useParams();
  const categoryName = getCategoryNameFromSlug(slug);

  // Always call useMemo unconditionally
  const filteredByCategory = useMemo(() => {
    if (!categoryName) return [];
    return olympiads.filter((evt) =>
      Array.isArray(evt.category)
        ? evt.category.includes(categoryName)
        : evt.category === categoryName
    );
  }, [olympiads, categoryName]);

  // Conditional render can happen *after* hooks
  if (!categoryName) {
    return (
      <Container className="mt-5 text-center">
        <h2>Category Not Found</h2>
        <p>
          “{slug}” is not a recognized category. Go back to <Link to="/">All Events</Link>.
        </p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-3">
        {categoryName} Events
      </h2>
      <OlympiadTable olympiads={filteredByCategory} loading={loading} />
    </Container>
  );
};

export default EventCategoryPage;
