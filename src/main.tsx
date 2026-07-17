import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Huella from "./Huella.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Huella />
  </StrictMode>
);