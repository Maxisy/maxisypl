import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Portfolio } from "./components/portfolio/portfolio";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
);
