import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import FeedbackForm from "../components/FeedbackForm";
import { pageLogging } from "../scripts/analyticsLogging";

export default function Feedback() {
  useEffect(() => {
    pageLogging("Feedback");
  }, []);

  return (
    <>
      <Navbar />
      <FeedbackForm />
    </>
  );
}
