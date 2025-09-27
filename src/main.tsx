import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
