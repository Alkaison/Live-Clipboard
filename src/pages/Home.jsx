import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { pageLogging } from "../scripts/analyticsLogging";

function Home() {
  useEffect(() => {
    pageLogging("Home");
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

export default Home;
