import { createContext } from "react";
import type { Symbol } from "@/@types/symbols";

interface SymbolsContextType {
  symbols: Symbol[];
  isLoading: boolean;
  error: Error | undefined;
}

export const SymbolsContext = createContext<SymbolsContextType | undefined>(
  undefined,
);
