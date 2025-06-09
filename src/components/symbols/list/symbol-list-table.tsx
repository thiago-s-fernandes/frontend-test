import { cn } from "@/lib/tailwind/utils";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type TableOptions,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SymbolListProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  options?: Omit<
    TableOptions<TData>,
    "data" | "columns" | "getCoreRowModel" | "getFilteredRowModel"
  >;
}

export function SymbolListTable<TData, TValue>({
  columns,
  data,
  options,
}: SymbolListProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  return (
    <div className="w-full border rounded-md h-[336px] overflow-y-scroll overflow-x-auto">
      <div className="w-full">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers?.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "bg-muted",
                      idx === 0 && "rounded-tl-md",
                      "[&>*:first-child]:[line-height:48px]",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows?.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={
                      options?.enableRowSelection && row.getIsSelected()
                        ? "selected"
                        : undefined
                    }
                  >
                    {row
                      .getVisibleCells()
                      ?.map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
