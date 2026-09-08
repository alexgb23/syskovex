import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SearchProvider } from "./context/SearchContext.jsx";
import "./style/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SearchProvider>
      <App />
    </SearchProvider>
  </BrowserRouter>,
);
