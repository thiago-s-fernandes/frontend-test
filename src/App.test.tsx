import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SymbolListManager } from "@/components/symbols/list/symbol-list-manager";
import { toast } from "sonner";
import { vi, describe, beforeEach, test, expect } from "vitest";
import * as zustandStore from "@/lib/zustand/stores/symbol-list-store";
import type { SymbolList } from "@/@types/symbols";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

let mockLists: SymbolList[] = [];
let mockActiveListId: string | null = null;

const mockAddList = vi.fn((name: string) => {
  const newList = { id: String(mockLists.length + 1), name, symbols: [] };
  mockLists.push(newList);
  return newList.id;
});

const mockSetActiveList = vi.fn((id: string | null) => {
  mockActiveListId = id;
});

const mockRemoveList = vi.fn((id: string | null) => {
  const index = mockLists.findIndex((l) => l.id === id);
  if (index !== -1) mockLists.splice(index, 1);
});

vi.mock("@/lib/zustand/stores/symbol-list-store", () => ({
  useSymbolListsStore: vi.fn(),
}));

describe("SymbolListManager", () => {
  beforeEach(() => {
    mockLists = [];
    mockActiveListId = null;

    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValue({
      lists: mockLists,
      activeListId: mockActiveListId,
      setActiveList: mockSetActiveList,
      addList: mockAddList,
      removeList: mockRemoveList,
    });

    vi.mocked(toast.error).mockClear();
    mockSetActiveList.mockClear();
    mockAddList.mockClear();
    mockRemoveList.mockClear();
  });

  test("full flow: add and remove list resets input", async () => {
    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Open modal add list"));
    fireEvent.click(screen.getByRole("button", { name: /add list/i }));
    expect(
      await screen.findByText("The list name cannot be empty."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("e.g. List A"), {
      target: { value: "My New List" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add list/i }));

    await waitFor(() => {
      expect(mockAddList).toHaveBeenCalledWith("My New List");
      expect(mockSetActiveList).toHaveBeenCalled();
    });

    const newListId = mockAddList.mock.results[0].value;
    mockLists.push({ id: newListId, name: "My New List", symbols: [] });
    mockActiveListId = newListId;

    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValue({
      lists: mockLists,
      activeListId: mockActiveListId,
      setActiveList: mockSetActiveList,
      addList: mockAddList,
      removeList: mockRemoveList,
    });

    fireEvent.click(screen.getByLabelText("Remove selected list"));

    mockRemoveList(mockActiveListId);
    mockSetActiveList(null);

    await waitFor(() => {
      expect(mockRemoveList).toHaveBeenCalledWith(newListId);
      expect(mockSetActiveList).toHaveBeenCalledWith(null);
    });

    expect(screen.getByText("Select a list")).toBeInTheDocument();
  });
});
