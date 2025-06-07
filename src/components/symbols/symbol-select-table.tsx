import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import SearchIcon from "@/components/icons/search-icon";

interface SymbolSelectTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  options?: Omit<
    TableOptions<TData>,
    "data" | "columns" | "getCoreRowModel" | "getFilteredRowModel"
  >;
}

export function SymbolSelectTable<TData, TValue>({
  columns,
  data,
  options,
}: SymbolSelectTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 6,
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex w-full relative">
        <Input
          placeholder="Search"
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon />
        </div>
      </div>

      <div
        ref={parentRef}
        className="w-full border rounded-md h-[336px] overflow-y-scroll overflow-x-hidden"
      >
        <div className="bg-muted sticky top-0 left-0 z-10 h-12">
          {table.getHeaderGroups()?.map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="flex h-full items-center text-sm font-medium px-2 gap-2"
            >
              {headerGroup.headers?.map((header) => (
                <div key={header.id} className="flex">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{ height: `${virtualizer.getTotalSize()}px` }}
          className="w-full"
        >
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                virtualizer.getVirtualItems()?.map((virtualRow, index) => {
                  const row = rows[virtualRow.index];

                  return (
                    <TableRow
                      key={row.id}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${
                          virtualRow.start - index * virtualRow.size
                        }px)`,
                      }}
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
    </div>
  );
}
