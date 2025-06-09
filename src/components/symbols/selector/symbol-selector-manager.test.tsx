import { render, screen, fireEvent } from "@testing-library/react";
import { SymbolSelectorManager } from "./symbol-selector-manager";
import { toast } from "sonner";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";
import { vi, describe, test, beforeEach, expect, type Mock } from "vitest";
import type { SymbolList, Symbol } from "@/@types/symbols";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/zustand/stores/symbol-list-store", () => ({
  useSymbolListsStore: vi.fn(),
}));

const mockedUseSymbolListsStore = useSymbolListsStore as unknown as Mock;

const mockAddSymbolsToList = vi.fn();

const mockStore = {
  addSymbolsToList: mockAddSymbolsToList,
  activeListId: "list-1",
  lists: [] as SymbolList[],
};

const symbols: Symbol[] = [
  { symbol: "AAPL" },
  { symbol: "MSFT" },
  { symbol: "GOOG" },
];

const renderComponent = (
  overrides: Partial<React.ComponentProps<typeof SymbolSelectorManager>> = {},
) => {
  return render(
    <SymbolSelectorManager
      isLoading={false}
      selectedSymbols={{}}
      setSelectedSymbols={vi.fn()}
      symbols={symbols}
      {...overrides}
    />,
  );
};

describe("SymbolSelectorManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSymbolListsStore.mockReturnValue(mockStore);
  });

  test("disables button when loading or no active list", () => {
    mockedUseSymbolListsStore.mockReturnValueOnce({
      ...mockStore,
      activeListId: null,
    });

    const { rerender } = renderComponent({ isLoading: false });
    const button = screen.getByRole("button", { name: /add to list/i });
    expect(button).toBeDisabled();

    rerender(
      <SymbolSelectorManager
        symbols={symbols}
        isLoading={true}
        selectedSymbols={{}}
        setSelectedSymbols={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("adds symbols to list when valid", () => {
    const selectedSymbols = { 0: true, 2: true };
    const setSelectedSymbols = vi.fn();

    renderComponent({ selectedSymbols, setSelectedSymbols });

    fireEvent.click(screen.getByRole("button", { name: /add to list/i }));

    expect(mockAddSymbolsToList).toHaveBeenCalledWith("list-1", [
      symbols[0],
      symbols[2],
    ]);
    expect(setSelectedSymbols).toHaveBeenCalledWith({});
  });

  test("shows duplicate error if symbols already in lists", () => {
    mockedUseSymbolListsStore.mockReturnValueOnce({
      ...mockStore,
      lists: [
        {
          id: "list-2",
          name: "List 2",
          symbols: [{ symbol: "AAPL" }],
        },
      ],
    });

    const selectedSymbols = { 0: true }; // AAPL
    renderComponent({ selectedSymbols });

    fireEvent.click(screen.getByRole("button", { name: /add to list/i }));

    expect(toast.error).toHaveBeenCalledWith("Duplicate symbols", {
      description: "Already added in other lists: AAPL",
    });
    expect(mockAddSymbolsToList).not.toHaveBeenCalled();
  });

  test("shows error if total symbols exceed 1024", () => {
    const bigList: SymbolList = {
      id: "list-2",
      name: "Big List",
      symbols: Array.from({ length: 1023 }, (_, i) => ({ symbol: `SYM${i}` })),
    };

    mockedUseSymbolListsStore.mockReturnValueOnce({
      ...mockStore,
      lists: [bigList],
    });

    const selectedSymbols = { 0: true, 1: true };

    renderComponent({ selectedSymbols });

    fireEvent.click(screen.getByRole("button", { name: /add to list/i }));

    expect(toast.error).toHaveBeenCalledWith("Limit exceeded", {
      description:
        "You can only have up to 1024 symbols across all lists. You already have 1023.",
    });
    expect(mockAddSymbolsToList).not.toHaveBeenCalled();
  });

  test("does nothing if no selection or no active list", () => {
    mockedUseSymbolListsStore.mockReturnValueOnce({
      ...mockStore,
      activeListId: null,
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /add to list/i }));

    expect(mockAddSymbolsToList).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
