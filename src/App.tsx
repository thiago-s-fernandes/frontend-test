import { SymbolList } from "@/components/symbols/list/symbol-list";
import { SymbolSelector } from "@/components/symbols/selector/symbol-selector";

export default function App() {
  return (
    <main
      role="main"
      className="bg-muted container h-full py-6 flex items-center justify-center min-md:h-dvh"
    >
      <div className="w-full flex flex-col gap-3 min-lg:flex-row">
        {/* Selector */}
        <div className="w-full flex rounded-md bg-white border border-muted p-4 shadow-md min-lg:max-w-[264px]">
          <SymbolSelector />
        </div>

        {/* List */}
        <div className="w-full flex rounded-md bg-white border border-muted p-4 shadow-md full min-lg:w-[calc(100%-264px)]">
          <SymbolList />
        </div>
      </div>
    </main>
  );
}
