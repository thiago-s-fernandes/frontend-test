import { Button } from "@/components/ui/button";
import { cn } from "@/lib/tailwind/utils";
import { PlusIcon } from "@/components/icons";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SymbolList } from "@/@types/symbols";

interface SymbolListProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lists: SymbolList[];
  onAddList: (name: string) => void;
  options?: Omit<
    TableOptions<TData>,
    "data" | "columns" | "getCoreRowModel" | "getFilteredRowModel"
  >;
}

export function SymbolListTable<TData, TValue>({
  columns,
  data,
  lists,
  onAddList,
  options,
}: SymbolListProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  function handleAddList() {
    const newName = `Nova Lista ${Date.now()}`;
    onAddList(newName);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-2">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a list" />
          </SelectTrigger>
          {lists?.length ? (
            <SelectContent>
              <SelectGroup>
                {lists?.map(({ id, name }) => (
                  <SelectItem key={id} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          ) : (
            <></>
          )}
        </Select>
        <Button
          aria-label="Add list"
          onClick={handleAddList}
          className="px-2.5"
        >
          <PlusIcon />
        </Button>
      </div>

      <div className="w-full border rounded-md">
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
              table.getRowModel().rows?.map((row) => (
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
              ))
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
