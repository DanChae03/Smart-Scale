import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // TODO: Enable StrictMode
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
