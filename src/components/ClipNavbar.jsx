import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, onDisconnect, onValue } from "firebase/database";

function ClipNavbar() {
  const navigate = useNavigate();
  const { code } = useParams();
  const statusColorRef = useRef(null);
  const [isDark, setIsDark] = useState(true);
  const [status, setStatus] = useState("Connecting...");
  const database = appDatabase;
  const roomRef = ref(database, `/${code}`); // Reference to the database

  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      localStorage.setItem("isDark", newIsDark ? "1" : "0");
      document.body.className = newIsDark ? "" : "light-theme";
      return newIsDark;
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // validate users joining code and set preferred theme
  useEffect(() => {
    const validateJoiningCode = (joiningCode) => {
      const codeLength = joiningCode.length;
      const regExp = /^[a-zA-Z0-9]+$/;
      const validCode = codeLength === 5 && regExp.test(joiningCode);

      if (!validCode) {
        navigate("/");
      }
    };

    validateJoiningCode(code);

    // check users theme preference
    const storedTheme = localStorage.getItem("isDark") || "1";
    document.body.className = storedTheme === "1" ? "" : "light-theme";
    setIsDark(storedTheme === "1");
  }, [code, navigate]);

  // check database connection status
  useEffect(() => {
    // Set up onDisconnect listener
    onDisconnect(roomRef);

    // Set up onValue listener for connection status
    const connectionStatusRef = ref(database, ".info/connected");
    const onValueCallback = (snapshot) => {
      const isConnected = snapshot.val();

      if (isConnected) {
        setStatus("Connected");
        statusColorRef.current.style.backgroundColor = "#affc41";
      } else {
        setStatus("Connecting...");
      }
    };

    onValue(connectionStatusRef, onValueCallback);
  }, [code, database, roomRef]);

  return (
    <div className="status">
      <div className="nav-title">
        <Link to="/" title="Clipboard">
          <img src="./assets/clipboard-logo.webp" alt="Clipboard Logo" />
          <span>Clipboard</span>
        </Link>
        <span id="clip-status" ref={statusColorRef}>
          {status}
        </span>
      </div>

      <div className="nav-content">
        <div className="cp-code">
          <img
            className="theme"
            src={isDark ? "assets/moon.webp" : "assets/sun.webp"}
            alt={isDark ? "Dark Theme" : "Light Theme"}
            onClick={toggleTheme}
          />
          <span
            title="Click to Copy"
            id="clip-code"
            onClick={handleCopyCode}
          >
            {code}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClipNavbar;
