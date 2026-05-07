import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./services/Landing";
import Audit from "./services/Audit";
import Result from "./services/Result";
import Report from "./services/Report";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/report/:slug" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;