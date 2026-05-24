import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-shell">
      <App />

      <footer className="app-footer">
        <p>
          <b>Built by:</b> Kaumudi Gulbarga for the Product Manager Accelerator
          Program (PMA) Internship 2026. &nbsp;
          <b>Description:</b> The Product Manager Accelerator Program is designed to support PM
          professionals through every stage of their careers. From students
          looking for entry-level jobs to Directors looking to take on a
          leadership role, our program has helped over hundreds of students
          fulfill their career aspirations.
        </p>
      </footer>
    </div>
  </StrictMode>,
);
