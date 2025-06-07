import { Button } from "@/components/ui/button";
import { symbolSelectColumns } from "@/columns/symbol-select-columns";
import { SymbolSelectTable } from "@/components/symbols/symbol-select-table";
import { useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import type { Symbol } from "@/@types/symbols";

interface Props {
  symbols: Symbol[];
  isLoading: boolean;
}

export function SymbolSelect({ symbols, isLoading }: Props) {
  const [symbolSelection, setSymbolSelection] = useState<RowSelectionState>({});

  const skeletonData = Array.from({ length: 6 }, (_, i) => ({
    symbol: `loading-${i}`,
    isSkeleton: true,
  }));

  const displaySymbols = isLoading ? skeletonData : symbols;

  return (
    <div className="w-full flex flex-col justify-between gap-4">
      <SymbolSelectTable
        data={displaySymbols}
        columns={symbolSelectColumns}
        options={{
          enableRowSelection: !isLoading,
          onRowSelectionChange: setSymbolSelection,
          state: {
            rowSelection: symbolSelection,
          },
        }}
      />

      <div className="flex w-full">
        <Button className="w-full" disabled={isLoading}>
          Add to List
        </Button>
      </div>
    </div>
  );
}
