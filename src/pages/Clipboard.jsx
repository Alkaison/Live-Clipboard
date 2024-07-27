import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/ClipNavbar";
import ClipField from "../components/ClipField";
import NoInternetComponent from "../components/NoInternetComponent";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";

function Clipboard() {
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);

  useEffect(() => {
    const updateInternetStatus = () => {
      setInternetStatus(navigator.onLine);
    };

    // Add event listeners to check online/offline status
    window.addEventListener("online", updateInternetStatus);
    window.addEventListener("offline", updateInternetStatus);

    pageLogging("Clipboard");

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateInternetStatus);
      window.removeEventListener("offline", updateInternetStatus);
    };
  }, []);

  return (
    <>
      <Helmet>
        <meta name="title" content="Clipboard | Realtime Collaboration" />
        <meta
          name="description"
          content="Join a clipboard room with a unique 5-character code to share and collaborate on text and images in real-time. Experience seamless and instant sharing."
        />
        <meta
          name="keywords"
          content="realtime clipboard, live collaboration, text sharing, image sharing, clipboard room, instant sharing, online clipboard"
        />
        <meta name="site.name" content="Realtime Clipboard" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Clipboard | Realtime Collaboration"
        />
        <meta
          property="og:description"
          content="Join a clipboard room and collaborate in real-time. Share text and images instantly with a simple 5-character code."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="Clipboard | Realtime Collaboration"
        />
        <meta
          property="twitter:description"
          content="Use the unique 5-character room code to enter a clipboard room and start collaborating in real-time. Share and edit content instantly."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>
          Clipboard | Realtime Collaboration - Share and Collaborate Instantly
        </title>
      </Helmet>

      <ClipNavbar internetStatus={internetStatus} />
      {internetStatus ? <ClipField /> : <NoInternetComponent />}
    </>
  );
}

export default Clipboard;
