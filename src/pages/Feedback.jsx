import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedbackForm from "../components/FeedbackForm";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";

export default function Feedback() {
  useEffect(() => {
    const today = new Date();
    const getData = JSON.parse(localStorage.getItem("feedback")) || {};

    localStorage.setItem(
      "feedback",
      JSON.stringify({
        ...getData,
        lastShown: today,
        hasOpenedFeedbackPageToday: true,
      })
    );

    pageLogging("Feedback");
  }, []);

  return (
    <>
      <Helmet>
        <meta name="title" content="Feedback | Realtime Clipboard" />
        <meta
          name="description"
          content="Share your experience using Realtime Clipboard and rate the platform out of 5 stars. Your feedback helps us improve our real-time collaboration tool."
        />
        <meta
          name="keywords"
          content="feedback, Realtime Clipboard reviews, user experience, rate platform, 5 stars rating, user feedback form"
        />
        <meta name="site.name" content="Realtime Clipboard" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://live-clipboard.netlify.app/feedback"
        />
        <meta property="og:title" content="Feedback | Realtime Clipboard" />
        <meta
          property="og:description"
          content="Provide feedback on your experience with Realtime Clipboard and rate the platform out of 5 stars. Help us enhance your real-time collaboration experience."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://live-clipboard.netlify.app/feedback"
        />
        <meta
          property="twitter:title"
          content="Feedback | Realtime Clipboard"
        />
        <meta
          property="twitter:description"
          content="Share your thoughts and rate Realtime Clipboard. Your feedback is crucial in helping us improve our collaborative platform."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>Feedback | Realtime Clipboard - Share Your Experience</title>

        <link
          rel="canonical"
          href="https://live-clipboard.netlify.app/feedback"
        />
      </Helmet>

      <Navbar />
      <FeedbackForm />
      <Footer />
    </>
  );
}
