import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Updates from "./pages/Updates";
import Clipboard from "./pages/Clipboard";
import Feedback from "./pages/Feedback";
import UserIdentification from "./components/UserIdentification";

function App() {
  return (
    <Router>
      {/* UserIdentification placed here to run on every page load */}
      <UserIdentification />
      <Routes>
        <Route extact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/:code" element={<Clipboard />} />
      </Routes>
    </Router>
  );
}

export default App;
