import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./app/globals.css";
import Portfolio from "./app/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
);
