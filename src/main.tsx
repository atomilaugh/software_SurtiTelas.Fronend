import React from "react";
import ReactDOM from "react-dom/client";
import App from "./presentation/pages/App";
import "./index.css";
import "./styles/variables.css";

import { AppProviders } from "@/app/providers/AppProviders";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);