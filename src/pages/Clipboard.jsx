import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/ClipNavbar";
import ClipField from "../components/ClipField";
import NoInternetComponent from "../components/NoInternetComponent";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Clipboard() {
  const navigate = useNavigate();
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("feedback")) || {};

    const checkToastShown = () => {
      if (getData?.hasSubmittedFeedbackResponse) {
        return true;
      }

      // const today = new Date();
      // const lastShown = new Date(getData?.lastShown || new Date());

      // extract only the date, not the time
      // const todayDate = today.toDateString();
      // const lastShownDate = lastShown.toDateString();

      // if (todayDate !== lastShownDate) {
      //   localStorage.setItem(
      //     "feedback",
      //     JSON.stringify({
      //       lastShown: today,
      //       hasOpenedFeedbackPageToday: false,
      //     })
      //   );
      //   return false;
      // }

      // if (!getData?.hasOpenedFeedbackPageToday) {
      //   return false;
      // }

      return false;
    };

    if (!checkToastShown()) {
      toast("We'd Love Your Feedback! 💛", {
        description:
          "Please let us know how you like our product and what we can improve. Thank you!",
        action: {
          label: "Give Feedback",
          onClick: () => navigate("/feedback"),
        },
        actionButtonStyle: {
          backgroundColor: "#002F48",
          fontFamily: "Rubik, sans-serif",
          color: "white",
          fontSize: "12px",
          letterSpacing: ".7px",
        },
        duration: Infinity,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <Toaster richColors={true} />
      <ClipNavbar internetStatus={internetStatus} />
      {internetStatus ? <ClipField /> : <NoInternetComponent />}
    </>
  );
}

export default Clipboard;
