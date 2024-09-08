import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import TermsConditionsContent from "../components/TermsConditionsContent";
import Navbar from "../components/Navbar";

function TermsConditions() {
  return (
    <>
      <Helmet>
        <meta name="title" content="Terms & Conditions | Realtime Clipboard" />
        <meta
          name="description"
          content="Review the Terms & Conditions for using Realtime Clipboard. Understand the rules and guidelines governing the use of our platform."
        />
        <meta
          name="keywords"
          content="Terms & Conditions, Realtime Clipboard, usage rules, platform guidelines, legal terms"
        />
        <meta name="site.name" content="Realtime Clipboard" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="https://live-clipboard.netlify.app/terms-conditions"
        />
        <meta
          property="og:title"
          content="Terms & Conditions | Realtime Clipboard"
        />
        <meta
          property="og:description"
          content="Read the Terms & Conditions for Realtime Clipboard to understand the rules and guidelines for using our platform."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://live-clipboard.netlify.app/terms-conditions"
        />
        <meta
          property="twitter:title"
          content="Terms & Conditions | Realtime Clipboard"
        />
        <meta
          property="twitter:description"
          content="Explore the Terms & Conditions for Realtime Clipboard to understand the terms of use and the guidelines for our platform."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>Terms & Conditions | Realtime Clipboard</title>

        <link
          rel="canonical"
          href="https://live-clipboard.netlify.app/terms-conditions"
        />
      </Helmet>

      <Navbar />
      <TermsConditionsContent />
      <Footer active={true} />
    </>
  );
}

export default TermsConditions;
