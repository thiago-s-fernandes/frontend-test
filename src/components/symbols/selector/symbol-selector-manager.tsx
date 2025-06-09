import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";
import type { Symbol } from "@/@types/symbols";
import type { RowSelectionState } from "@tanstack/react-table";

interface Props {
  symbols: Symbol[];
  isLoading: boolean;
  selectedSymbols: RowSelectionState;
  setSelectedSymbols: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function SymbolSelectorManager({
  symbols,
  isLoading,
  selectedSymbols,
  setSelectedSymbols,
}: Props) {
  const { addSymbolsToList, activeListId, lists } = useSymbolListsStore();

  const handleAddSymbols = () => {
    const keysSelectedSymbols = Object.keys(selectedSymbols);

    if (!activeListId || keysSelectedSymbols.length === 0) return;

    const selectedRows = keysSelectedSymbols.map((key) => symbols[Number(key)]);

    const allSymbolsInLists = new Set<string>();
    for (const list of lists) {
      for (const s of list.symbols) {
        allSymbolsInLists.add(s.symbol);
      }
    }

    const duplicates = selectedRows
      .filter((s) => allSymbolsInLists.has(s.symbol))
      .map((s) => s.symbol);

    if (duplicates.length > 0) {
      toast.error("Duplicate symbols", {
        description: `Already added in other lists: ${duplicates.join(", ")}`,
      });
      return;
    }

    const totalAfterAddition = allSymbolsInLists.size + selectedRows.length;

    if (totalAfterAddition > 1024) {
      toast.error("Limit exceeded", {
        description: `You can only have up to 1024 symbols across all lists. You already have ${allSymbolsInLists.size}.`,
      });
      return;
    }

    addSymbolsToList(activeListId, selectedRows);
    setSelectedSymbols({});
  };

  return (
    <div className="flex w-full">
      <Button
        className="w-full"
        disabled={isLoading || !activeListId}
        onClick={handleAddSymbols}
      >
        Add to List
      </Button>
    </div>
  );
}
