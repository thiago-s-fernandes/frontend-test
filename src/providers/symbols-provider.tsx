import { SymbolsContext } from "@/contexts/symbols-context";
import { useBinanceSymbols } from "@/hooks/use-binance-symbols";
import type { ReactNode } from "react";

export const SymbolsProvider = ({ children }: { children: ReactNode }) => {
  const { symbols, isLoading, error } = useBinanceSymbols();

  return (
    <SymbolsContext.Provider value={{ symbols, isLoading, error }}>
      {children}
    </SymbolsContext.Provider>
  );
};
