import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import ReleaseNotes from "../components/ReleaseNotes";
import { pageLogging } from "../scripts/analyticsLogging";

function Updates() {
  useEffect(() => {
    pageLogging("Updates");
  }, []);

  return (
    <>
      <Navbar />
      <ReleaseNotes />
    </>
  );
}

export default Updates;
