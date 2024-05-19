import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Updates from "./pages/Updates";
import Clipboard from "./pages/Clipboard";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route extact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/:code" element={<Clipboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
