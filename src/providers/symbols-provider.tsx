import { SymbolsContext } from "@/contexts/symbols-context";
import { useSymbols } from "@/hooks/use-symbols";
import type { ReactNode } from "react";

export const SymbolsProvider = ({ children }: { children: ReactNode }) => {
  const { symbols, isLoading, error } = useSymbols();

  return (
    <SymbolsContext.Provider value={{ symbols, isLoading, error }}>
      {children}
    </SymbolsContext.Provider>
  );
};
