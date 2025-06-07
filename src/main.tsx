import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { SymbolsProvider } from "@/providers/symbols-provider";
import App from "@/App";

import "@/styles/tailwind.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SymbolsProvider>
      <App />
    </SymbolsProvider>
  </StrictMode>,
);
