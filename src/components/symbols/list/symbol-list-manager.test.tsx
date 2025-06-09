import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SymbolListManager } from "./symbol-list-manager";
import { toast } from "sonner";
import { vi, describe, beforeEach, test, expect } from "vitest";
import * as zustandStore from "@/lib/zustand/stores/symbol-list-store";
import type { SymbolList } from "@/@types/symbols";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/lib/zustand/stores/symbol-list-store", () => ({
  useSymbolListsStore: vi.fn(),
}));

const mockListFulfilled = [
  { id: "1", name: "List One", symbols: [] },
  { id: "2", name: "List Two", symbols: [] },
];
let mockActiveListId: string | null = null;
const mockAddList = vi.fn((name: string) => {
  const newList = { id: `${mockList.length + 1}`, name, symbols: [] };
  mockList.push(newList);
  mockActiveListId = newList.id;
});
const mockList: SymbolList[] = [];
const mockRemoveList = vi.fn();
const mockSetActiveList = vi.fn((id: string | null) => {
  mockActiveListId = id;
});

describe("SymbolListManager", () => {
  beforeEach(() => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValue({
      lists: mockList,
      activeListId: mockActiveListId,
      addList: mockAddList,
      removeList: mockRemoveList,
      setActiveList: mockSetActiveList,
    });

    vi.mocked(toast.error).mockClear();
    mockSetActiveList.mockClear();
    mockAddList.mockClear();
    mockRemoveList.mockClear();
  });

  test("renders empty list state correctly", () => {
    render(<SymbolListManager />);

    expect(screen.getByText("Select a list"));
    expect(mockList.length).toEqual(0);

    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("select-group").childElementCount).toBe(0);
  });

  test("selects a list and calls setActiveList with correct ID", () => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValue({
      lists: mockListFulfilled,
      activeListId: null,
      addList: mockAddList,
      removeList: mockRemoveList,
      setActiveList: mockSetActiveList,
    });

    render(<SymbolListManager />);

    expect(screen.getByText("Select a list"));
    fireEvent.click(screen.getByRole("combobox"));

    const listOne = screen.getByText("List One");
    expect(listOne).toBeInTheDocument();
    fireEvent.click(listOne);

    expect(mockSetActiveList).toHaveBeenCalledWith("1");
    expect(mockActiveListId).toBe("1");
  });

  test("opens modal and shows validation error if list name empty", async () => {
    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Open modal add list"));

    fireEvent.click(screen.getByRole("button", { name: /add list/i }));

    expect(
      await screen.findByText("The list name cannot be empty."),
    ).toBeInTheDocument();
  });

  test("creates a new list and closes modal", async () => {
    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Open modal add list"));

    fireEvent.change(screen.getByPlaceholderText("e.g. List A"), {
      target: { value: "My New List" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add list/i }));

    await waitFor(() => {
      expect(mockAddList).toHaveBeenCalledWith("My New List");
      expect(screen.getByText("My New List"));
    });
  });

  test("removes active list", () => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValueOnce({
      lists: mockListFulfilled,
      activeListId: "1",
      setActiveList: mockSetActiveList,
      addList: mockAddList,
      removeList: mockRemoveList,
    });

    const { rerender } = render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Remove selected list"));

    expect(mockRemoveList).toHaveBeenCalledWith("1");
    expect(mockSetActiveList).toHaveBeenCalledWith(null);

    rerender(<SymbolListManager />);
    expect(screen.getByText("Select a list"));
  });

  test("shows toast error if no active list when removing", () => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValueOnce({
      lists: mockListFulfilled,
      activeListId: null,
      setActiveList: mockSetActiveList,
      addList: mockAddList,
      removeList: mockRemoveList,
    });

    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Remove selected list"));

    expect(toast.error).toHaveBeenCalledWith(
      "No active list selected to remove.",
    );
    expect(mockRemoveList).not.toHaveBeenCalled();
  });
});
