import { SymbolListTable } from "@/components/symbols/symbol-list-table";
import {
  symbolListColumns,
  type SymbolListColumns,
} from "@/columns/symbol-list-columns";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";

const symbolListData: SymbolListColumns[] = [
  {
    symbol: "ETHBTC",
    lastPrice: "0.0025",
    bidPrice: "0.0025",
    askPrice: "0.0026",
    priceChange: "250",
  },
  {
    symbol: "BNBBTC",
    lastPrice: "0.0025",
    bidPrice: "0.0025",
    askPrice: "0.0026",
    priceChange: "250",
  },
];

export function SymbolList() {
  const { lists, addList } = useSymbolListsStore();

  return (
    <div className="flex w-full flex-col gap-2">
      <SymbolListTable
        data={symbolListData}
        columns={symbolListColumns}
        lists={lists}
        onAddList={addList}
      />
    </div>
  );
}
