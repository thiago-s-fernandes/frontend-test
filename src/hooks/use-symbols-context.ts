import { SymbolsContext } from "@/contexts/symbols-context";
import { useContext } from "react";

export const useSymbolsContext = () => {
  const context = useContext(SymbolsContext);

  if (!context) {
    throw new Error("useSymbolsContext must be used within a SymbolsProvider");
  }

  return context;
};
