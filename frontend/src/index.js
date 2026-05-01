import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { initPublicData } from "@/data/mockData";

const root = ReactDOM.createRoot(document.getElementById("root"));

initPublicData()
  .catch(() => {})
  .finally(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
