import React from "react";
import ReactDOM from "react-dom/client";
import App from "./presentation/pages/App";
import "./index.css";
import "./styles/variables.css";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { AppProviders } from "@/app/providers/AppProviders";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <App />
      </AppProviders>
    </QueryClientProvider>
  </React.StrictMode>
);