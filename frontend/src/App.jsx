import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./pages/Landing";
import Audit from "./pages/Audit";
import Result from "./pages/Result";
import Report from "./pages/Report";
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