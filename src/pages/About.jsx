import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import AboutText from "../components/AboutText";
import { pageLogging } from "../scripts/analyticsLogging";

function About() {
  useEffect(() => {
    pageLogging("About");
  }, []);

  return (
    <>
      <Navbar />
      <AboutText />
    </>
  );
}

export default About;
