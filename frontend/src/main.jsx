import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const API = import.meta.env.VITE_API_URL;

fetch(`${API}/api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);