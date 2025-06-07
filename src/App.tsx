import { SymbolList } from "@/components/symbols/symbol-list";
import { SymbolSelect } from "@/components/symbols/symbol-select";
import { useSymbolsContext } from "@/hooks/use-symbols-context";

export default function App() {
  const { symbols, isLoading } = useSymbolsContext();

  return (
    <main
      role="main"
      className="container h-dvh flex items-center justify-center"
    >
      <div className="w-full flex gap-3">
        {/* Search */}
        <div className="flex">
          <SymbolSelect symbols={symbols} isLoading={isLoading} />
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 w-[calc(100%-262px)]">
          <SymbolList />
        </div>
      </div>
    </main>
  );
}
