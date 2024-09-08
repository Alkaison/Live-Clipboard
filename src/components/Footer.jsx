import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer({ active = false }) {
  return (
    <footer className="footer">
      <div className={`footer-content ${active ? "active" : ""}`}>
        <p>©️ Realtime Clipboard 2024. All Rights Reserved</p>
        <p>
          <Link to="/about">About Us</Link>
          <span>|</span>
          <Link to="/feedback">Contact Us</Link>
          <span>|</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>|</span>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
