import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isNavbarActive, setNavbarActive] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleNavbarContainer = () => {
    setNavbarActive(!isNavbarActive);
  };

  // change the app's theme
  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      localStorage.setItem("isDark", newIsDark ? "1" : "0");
      document.body.className = newIsDark ? "" : "light-theme";
      return newIsDark;
    });
    toggleNavbarContainer();
  };

  // Get preferred theme from local storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("isDark") || "1";
    document.body.className = storedTheme === "1" ? "" : "light-theme";
    setIsDark(storedTheme === "1");
  }, []);

  return (
    <div className="Navbar" role="navigation" aria-label="Navigation Bar">
      <div className="nav-title">
        <Link to="/" title="Realtime Clipboard">
          <img src="./assets/clipboard-logo.webp" alt="Clipboard Logo" />
          <span>Realtime Clipboard</span>
        </Link>
      </div>

      <div
        className="humburger-icon"
        role="button"
        aria-label="Toggle Navigation Menu"
        onClick={toggleNavbarContainer}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path
            fill={isDark ? "#ffffff" : "#000000"}
            d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
          />
        </svg>
      </div>

      <ul
        className={`nav-container ${isNavbarActive ? "active" : ""}`}
        role="menubar"
        aria-label="Main Menu"
      >
        <li className="mobile-title" role="menuitem">
          <span
            className="cross-icon"
            aria-hidden="true"
            onClick={toggleNavbarContainer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </span>
          <span>Menus</span>
        </li>
        <li role="menuitem">
          <img
            className="theme"
            src={isDark ? "assets/moon.png" : "assets/sun.webp"}
            alt={isDark ? "Dark Theme" : "Light Theme"}
            onClick={toggleTheme}
          />
        </li>
        <li role="menuitem">
          <Link to="/" className="nav-items">
            Home
          </Link>
        </li>
        <li role="menuitem">
          <Link to="/about" className="nav-items">
            About
          </Link>
        </li>
        <li role="menuitem">
          <Link to="/updates" className="nav-items">
            Updates
          </Link>
        </li>
        <li role="menuitem">
          <Link to="/feedback" className="nav-items">
            Feedback
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
