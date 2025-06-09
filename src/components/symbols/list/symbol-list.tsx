import { symbolListColumns } from "@/components/symbols/list/symbol-list-columns";
import { SymbolListManager } from "@/components/symbols/list/symbol-list-manager";
import { SymbolListTable } from "@/components/symbols/list/symbol-list-table";
import { useBinanceWebSocket } from "@/hooks/use-binance-websocket";
import { useMemo } from "react";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";

export function SymbolList() {
  const { getActiveList } = useSymbolListsStore();
  const { symbols } = getActiveList() ?? {};

  const { tickerData } = useBinanceWebSocket({
    symbols: symbols ?? [],
  });

  const symbolsWithData = useMemo(() => {
    if (!symbols) return [];

    return symbols.map((symbol) => ({
      ...symbol,
      lastPrice: tickerData[symbol.symbol]?.c || undefined,
      askPrice: tickerData[symbol.symbol]?.a || undefined,
      bidPrice: tickerData[symbol.symbol]?.b || undefined,
      priceChange: tickerData[symbol.symbol]?.P || undefined,
    }));
  }, [symbols, tickerData]);

  return (
    <div className="flex w-full flex-col gap-2">
      <SymbolListManager />
      <SymbolListTable
        data={symbolsWithData ?? []}
        columns={symbolListColumns}
      />
    </div>
  );
}
