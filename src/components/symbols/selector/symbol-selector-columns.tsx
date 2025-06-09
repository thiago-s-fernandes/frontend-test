import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";

export type SymbolSelectorColumns = {
  symbol: string;
  isSkeleton?: boolean;
};

export const SymbolSelectorColumns: ColumnDef<SymbolSelectorColumns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) =>
      row.original.isSkeleton ? (
        <div data-slot="null"></div>
      ) : (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select symbol ${row.getValue("symbol")}`}
          id={row.getValue("symbol")}
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "symbol",
    header: () => (
      <div className="flex min-w-60">
        <span>Symbol</span>
      </div>
    ),
    cell: ({ row }) =>
      row.original.isSkeleton ? (
        <Skeleton
          className="h-8 w-[calc(100%-8px)]"
          data-testid={row.getValue("symbol")}
        />
      ) : (
        row.original.symbol
      ),
  },
];
