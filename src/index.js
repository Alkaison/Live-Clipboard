import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import swDev from "./swDev";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("realtime-clipboard"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// serviceWorker Register
swDev();
