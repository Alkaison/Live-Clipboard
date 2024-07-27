import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { pageLogging } from "../scripts/analyticsLogging";
import { Helmet } from "react-helmet";

function Home() {
  useEffect(() => {
    pageLogging("Home");
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="title"
          content="Realtime Clipboard: Instant Text & Image Sharing | Collaborative Board"
        />
        <meta
          name="description"
          content="Realtime Clipboard is your go-to tool for real-time collaboration. Instantly share, edit, and manage text and images on live collaborative boards. Perfect for developers, teams, and content creators."
        />
        <meta
          name="keywords"
          content="Realtime Clipboard, live clipboard, online clipboard, text sharing, image sharing, collaboration tool, real-time editing, copy paste online, developer tools, team collaboration, content creation"
        />
        <meta name="site.name" content="Realtime Clipboard" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://live-clipboard.netlify.app/" />
        <meta
          property="og:title"
          content="Realtime Clipboard: Instant Text & Image Sharing | Collaborative Board"
        />
        <meta
          property="og:description"
          content="Discover Realtime Clipboard - a platform for real-time text and image sharing. Collaborate instantly with live boards, ideal for developers, teams, and content creators."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://live-clipboard.netlify.app/"
        />
        <meta
          property="twitter:title"
          content="Realtime Clipboard: Instant Text & Image Sharing | Collaborative Board"
        />
        <meta
          property="twitter:description"
          content="Realtime Clipboard enables instant collaboration with real-time text and image sharing. Perfect for teams and creators looking to streamline their workflows."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>
          Realtime Clipboard: Instant Text & Image Sharing | Collaborative Board
        </title>
      </Helmet>

      <Navbar />
      <Hero />
    </>
  );
}

export default Home;
