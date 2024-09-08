import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Updates from "./pages/Updates";
import Clipboard from "./pages/Clipboard";
import Feedback from "./pages/Feedback";
import UserIdentification from "./components/UserIdentification";
import UpdateAvailableServiceWorker from "./components/UpdateAvailableServiceWorker";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
import TestFieldComponent from "./components/TestFieldComponent";

function App() {
  return (
    <Router>
      {/* UserIdentification placed here to run on every page load */}
      <UserIdentification />

      {/* New Update Banner and Version Release */}
      <UpdateAvailableServiceWorker />

      <ScrollToTop />
      <Routes>
        <Route extact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/highlight" element={<TestFieldComponent />} />
        <Route path="/:code" element={<Clipboard />} />
      </Routes>
    </Router>
  );
}

export default App;
