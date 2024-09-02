import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "../styles/FAQsIcon.css";

function FAQsIcon() {
  return (
    <>
      <Link
        to="/about#faqs"
        className="faqs-icon"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Explore our FAQs"
      >
        ?
      </Link>

      <Tooltip id="my-tooltip" />
    </>
  );
}

export default FAQsIcon;
