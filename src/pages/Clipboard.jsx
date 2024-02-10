import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/ClipNavbar";
import ClipField from "../components/ClipField";
import NoInternetComponent from "../components/NoInternetComponent";

function Clipboard() {
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);

  useEffect(() => {
    const updateInternetStatus = () => {
      setInternetStatus(navigator.onLine);
    };

    // Add event listeners to check online/offline status
    window.addEventListener("online", updateInternetStatus);
    window.addEventListener("offline", updateInternetStatus);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateInternetStatus);
      window.removeEventListener("offline", updateInternetStatus);
    };
  }, []);

  return (
    <>
      <ClipNavbar internetStatus={internetStatus} />
      {internetStatus ? <ClipField /> : <NoInternetComponent />}
    </>
  );
}

export default Clipboard;
