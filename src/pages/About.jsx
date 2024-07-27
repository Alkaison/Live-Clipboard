import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import AboutText from "../components/AboutText";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";

function About() {
  useEffect(() => {
    pageLogging("About");
  }, []);

  return (
    <>
      <Helmet>
        <meta name="title" content="About Us | Realtime Clipboard" />
        <meta
          name="description"
          content="Realtime Clipboard is a powerful and easy-to-use web app for instant sharing of text and images, built by a dedicated team of developers."
        />
        <meta
          name="keywords"
          content="Realtime Clipboard, About Us, Real-time Collaboration, Text Sharing, Image Sharing, Developers, Team"
        />
        <title>About Us | Realtime Clipboard</title>

        <meta property="og:title" content="About Us | Realtime Clipboard" />
        <meta
          property="og:description"
          content="Learn more about Realtime Clipboard, a platform that redefines real-time text and image sharing. Discover the team behind the scenes."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />
        <meta
          property="og:url"
          content="https://live-clipboard.netlify.app/about"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Realtime Clipboard" />
        <meta
          name="twitter:description"
          content="Learn more about Realtime Clipboard and the team behind this innovative real-time collaboration tool."
        />
        <meta
          name="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <link rel="canonical" href="https://live-clipboard.netlify.app/about" />
      </Helmet>

      <Navbar />
      <AboutText />
    </>
  );
}

export default About;
