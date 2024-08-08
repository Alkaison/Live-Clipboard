import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import ReleaseNotes from "../components/ReleaseNotes";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";

function Updates() {
  useEffect(() => {
    pageLogging("Updates");
  }, []);

  return (
    <>
      <Helmet>
        <meta name="title" content="Updates | Realtime Clipboard" />
        <meta
          name="description"
          content="Stay informed with the latest updates and changes to Realtime Clipboard. Get detailed documentation on new features and improvements."
        />
        <meta
          name="keywords"
          content="Realtime Clipboard updates, new features, release notes, documentation, changes, latest updates"
        />
        <meta name="site.name" content="Realtime Clipboard" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://live-clipboard.netlify.app/updates"
        />
        <meta property="og:title" content="Updates | Realtime Clipboard" />
        <meta
          property="og:description"
          content="Check out the latest updates and enhancements in Realtime Clipboard. Explore new features and improvements to enhance your real-time collaboration experience."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://live-clipboard.netlify.app/updates"
        />
        <meta property="twitter:title" content="Updates | Realtime Clipboard" />
        <meta
          property="twitter:description"
          content="Stay up-to-date with the latest features and improvements in Realtime Clipboard. Discover what's new and how it can enhance your experience."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>
          Updates | Realtime Clipboard - Latest Features & Improvements
        </title>

        <link
          rel="canonical"
          href="https://live-clipboard.netlify.app/updates"
        />
      </Helmet>

      <Navbar />
      <ReleaseNotes />
    </>
  );
}

export default Updates;
