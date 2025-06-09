import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/utils/generate-id";
import type { Symbol, SymbolList } from "@/@types/symbols";

interface SymbolListsStore {
  lists: SymbolList[];
  addList: (name: string) => string;
  removeList: (id: string) => void;
  getAllLists: () => SymbolList[];
  clearAllLists: () => void;
  activeListId: string | null;
  setActiveList: (id: string | null) => void;
  getActiveList: () => SymbolList | null;
  addSymbolsToList: (listId: string, symbols: Symbol[]) => void;
  removeSymbolFromList: (listId: string, symbolCode: string) => void;
}

export const useSymbolListsStore = create<SymbolListsStore>()(
  persist(
    (set, get) => ({
      lists: [],

      addList: (name) => {
        const id = generateId();

        set((state) => ({
          lists: [...state.lists, { id, name, symbols: [] }],
        }));

        return id;
      },
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),

      getAllLists: () => {
        const { lists } = get();
        return lists;
      },

      clearAllLists: () => set({ lists: [] }),

      activeListId: null,

      setActiveList: (id) => set({ activeListId: id }),

      getActiveList: () => {
        const { lists, activeListId } = get();
        return lists.find((list) => list.id === activeListId) || null;
      },

      addSymbolsToList: (listId, symbols) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  symbols: [
                    ...list.symbols,
                    ...symbols.filter(
                      (newSymbol) =>
                        !list.symbols.some(
                          (s) => s.symbol === newSymbol.symbol,
                        ),
                    ),
                  ],
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
    }),
    {
      name: "symbol-lists-storage",
    },
  ),
);
