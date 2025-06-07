import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/utils/generate-id";
import type { Symbol, SymbolList } from "@/@types/symbols";

interface SymbolListsStore {
  lists: SymbolList[];
  addList: (name: string) => void;
  removeList: (id: string) => void;
  addSymbolToList: (listId: string, symbol: Symbol) => void;
  removeSymbolFromList: (listId: string, symbolCode: string) => void;
  clearAllLists: () => void;
  getAllLists: () => SymbolList[];
}

export const useSymbolListsStore = create<SymbolListsStore>()(
  persist(
    (set, get) => ({
      lists: [],

      addList: (name) =>
        set((state) => ({
          lists: [...state.lists, { id: generateId(), name, symbols: [] }],
        })),

      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),

      addSymbolToList: (listId, symbol) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  symbols: list.symbols.some((s) => s.symbol === symbol.symbol)
                    ? list.symbols
                    : [...list.symbols, symbol],
                }
              : list,
          ),
        })),

      removeSymbolFromList: (listId, symbolCode) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  symbols: list.symbols.filter((s) => s.symbol !== symbolCode),
                }
              : list,
          ),
        })),

      clearAllLists: () => set({ lists: [] }),

      getAllLists: () => {
        const { lists } = get();
        return lists;
      },
    }),
    {
      name: "symbol-lists-storage",
    },
  ),
);
