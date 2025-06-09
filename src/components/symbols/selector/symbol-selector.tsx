import { SymbolSelectorColumns } from "@/components/symbols/selector/symbol-selector-columns";
import { SymbolSelectorManager } from "./symbol-selector-manager";
import { SymbolSelectorTable } from "@/components/symbols/selector/symbol-selector-table";
import { useState } from "react";
import { useSymbolsContext } from "@/hooks/use-symbols-context";
import type { RowSelectionState } from "@tanstack/react-table";

export function SymbolSelector() {
  const [selectedSymbols, setSelectedSymbols] = useState<RowSelectionState>({});
  const { symbols, isLoading } = useSymbolsContext();

  const skeletonData = Array.from({ length: 6 }, (_, i) => ({
    symbol: `loading-${i}`,
    isSkeleton: true,
  }));

  const displaySymbols = isLoading ? skeletonData : symbols;

  return (
    <div className="w-full flex flex-col justify-between gap-4">
      <SymbolSelectorTable
        data={displaySymbols}
        columns={SymbolSelectorColumns}
        options={{
          enableRowSelection: !isLoading,
          onRowSelectionChange: setSelectedSymbols,
          state: {
            rowSelection: selectedSymbols,
          },
        }}
      />

      <SymbolSelectorManager
        symbols={symbols}
        isLoading={isLoading}
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
      />
    </div>
  );
}
