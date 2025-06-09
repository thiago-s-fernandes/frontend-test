import { cn } from "@/lib/tailwind/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Symbol } from "@/@types/symbols";
import type { ColumnDef } from "@tanstack/react-table";

export const symbolListColumns: ColumnDef<Symbol>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "lastPrice",
    header: "Last Price",
    cell: ({ row }) => {
      const value = row.getValue("lastPrice") as string | undefined;

      if (!value) return <Skeleton className="w-full h-8" />;

      return value;
    },
  },
  {
    accessorKey: "bidPrice",
    header: "Bid Price",
    cell: ({ row }) => {
      const value = row.getValue("bidPrice") as string | undefined;

      if (!value) return <Skeleton className="w-full h-8" />;

      return value;
    },
  },
  {
    accessorKey: "askPrice",
    header: "Ask Price",
    cell: ({ row }) => {
      const value = row.getValue("askPrice") as string | undefined;

      if (!value) return <Skeleton className="w-full h-8" />;

      return value;
    },
  },
  {
    accessorKey: "priceChange",
    header: () => <span className="block text-right">Price Change (%)</span>,
    cell: ({ row }) => {
      const value = row.getValue("priceChange") as string | undefined;

      if (!value)
        return (
          <div className="flex justify-end">
            <Skeleton className="w-full h-8" />
          </div>
        );

      const isNegative = parseFloat(value) < 0;
      const strValue = String(value);
      const formattedPriceChange = `${strValue}%`;

      return (
        <div className="flex justify-end">
          <span
            className={cn(
              "flex items-center justify-center  py-[3px] px-3 rounded-full border leading-6",
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
];
