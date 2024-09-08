import React from "react";
import { Helmet } from "react-helmet";
import PrivacyPolicyContent from "../components/PrivacyPolicyContent";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <meta name="title" content="Privacy Policy | Realtime Clipboard" />
        <meta
          name="description"
          content="Read our Privacy Policy to understand how Realtime Clipboard handles and protects your data. Learn about our commitment to user privacy and security."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Realtime Clipboard, data protection, user privacy, security, information handling"
        />
        <meta name="site.name" content="Realtime Clipboard" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="https://live-clipboard.netlify.app/privacy-policy"
        />
        <meta
          property="og:title"
          content="Privacy Policy | Realtime Clipboard"
        />
        <meta
          property="og:description"
          content="Learn about how Realtime Clipboard manages your personal data, including our privacy practices and security measures."
        />
        <meta
          property="og:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://live-clipboard.netlify.app/privacy-policy"
        />
        <meta
          property="twitter:title"
          content="Privacy Policy | Realtime Clipboard"
        />
        <meta
          property="twitter:description"
          content="Read our Privacy Policy to understand our approach to user data privacy and security on Realtime Clipboard."
        />
        <meta
          property="twitter:image"
          content="https://github.com/Alkaison/Live-Clipboard/assets/98116504/7fd42dd2-2dd2-4464-a780-a3a4eee61d7a"
        />

        <title>Privacy Policy | Realtime Clipboard</title>

        <link
          rel="canonical"
          href="https://live-clipboard.netlify.app/privacy-policy"
        />
      </Helmet>

      <Navbar />
      <PrivacyPolicyContent />
      <Footer active={true} />
    </>
  );
}

export default PrivacyPolicy;
