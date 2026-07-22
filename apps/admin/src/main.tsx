import React from "react";
import ReactDOM from "react-dom/client";
import "@presstronic-academy/ui/styles.css";
import "./styles.css";
import { App } from "./app";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
