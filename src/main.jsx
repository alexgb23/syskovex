import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SearchProvider } from "./context/SearchContext.jsx";
import "./style/index.css";
import App from "./App.jsx";

const [navigation] = performance.getEntriesByType("navigation");

if (navigation && navigation.type === "reload") {
  window.scrollTo(0, 0);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SearchProvider>
      <App />
    </SearchProvider>
  </BrowserRouter>,
);
