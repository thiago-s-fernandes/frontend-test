import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";

export type SymbolSelectColumns = {
  symbol: string;
  isSkeleton?: boolean;
};

export const symbolSelectColumns: ColumnDef<SymbolSelectColumns>[] = [
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
          aria-label="Select row"
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
        <Skeleton className="h-8 w-[calc(100%-8px)]" />
      ) : (
        row.original.symbol
      ),
  },
];
