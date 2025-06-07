import { cn } from "@/lib/tailwind/utils";
import type { ColumnDef } from "@tanstack/react-table";

export type SymbolListColumns = {
  symbol: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  priceChange: string;
};

export const symbolListColumns: ColumnDef<SymbolListColumns>[] = [
  {
    accessorKey: "symbol",
    header: () => <span className="block min-lg:min-w-40">Symbol</span>,
  },
  {
    accessorKey: "lastPrice",
    header: "Last Price",
  },
  {
    accessorKey: "bidPrice",
    header: "Bid Price",
  },
  {
    accessorKey: "askPrice",
    header: "Ask Price",
  },
  {
    accessorKey: "priceChange",
    header: () => <span className="block text-right">Price Change (%)</span>,
    cell: ({ row }) => {
      const isNegative = parseFloat(row.getValue("priceChange")) < 0;
      const value = String(row.getValue("priceChange") ?? "");
      const formattedPriceChange = `${value}%`;

      return (
        <div className="flex justify-end">
          <span
            className={cn(
              "flex items-center justify-center  py-1 px-3 rounded-full border leading-6",
              !isNegative
                ? "bg-green-500/10 text-green-700 border-green-500/20"
                : "bg-red-500/10 text-red-700 border-red-500/20",
            )}
          >
            {formattedPriceChange}
          </span>
        </div>
      );
    },
  },
  {
    id: "empty",
    header: () => <div className="min-w-4"></div>,
  },
];
