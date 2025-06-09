import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SymbolListManager } from "@/components/symbols/list/symbol-list-manager";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockLists = [
  { id: "list-a", name: "List A" },
  { id: "list-b", name: "List B" },
];

let activeListId: string | null = "list-a";
const setActiveList = vi.fn((id: string | null) => {
  activeListId = id;
});
const addList = vi.fn((name: string) => {
  const id = `list-${mockLists.length}`;
  const newList = { id, name };
  mockLists.push(newList);
  return id;
});
const removeList = vi.fn((id: string) => {
  const index = mockLists.findIndex((l) => l.id === id);
  if (index !== -1) mockLists.splice(index, 1);
});

vi.mock("@/lib/zustand/stores/symbol-list-store", () => {
  return {
    useSymbolListsStore: vi.fn(() => ({
      lists: mockLists,
      activeListId,
      setActiveList,
      addList,
      removeList,
    })),
  };
});

describe("SymbolListManager", () => {
  beforeEach(() => {
    activeListId = "list-a";
    mockLists.splice(
      0,
      mockLists.length,
      { id: "list-a", name: "List A" },
      { id: "list-b", name: "List B" },
    );
    vi.clearAllMocks();

    render(<SymbolListManager />);
  });

  test("displays available lists and allows switching active list", () => {
    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const listB = screen.getByText("List B");
    fireEvent.click(listB);

    expect(screen.getByText("List B")).toBeInTheDocument();
  });

  test("opens modal and creates a new list with valid name", () => {
    const openModalButton = screen.getByLabelText("Open modal add list");
    fireEvent.click(openModalButton);

    const input = screen.getByPlaceholderText("e.g. List A");
    fireEvent.change(input, { target: { value: "New List" } });

    const submitButton = screen.getByText("Add List");
    fireEvent.click(submitButton);

    expect(screen.queryByText("New List")).toBeTruthy();
  });

  test("does not allow creating a list with an empty name", () => {
    const openModalButton = screen.getByLabelText("Open modal add list");
    fireEvent.click(openModalButton);

    const submitButton = screen.getByText("Add List");
    fireEvent.click(submitButton);

    expect(
      screen.getByText("The list name cannot be empty."),
    ).toBeInTheDocument();
  });

  test("removes the active list when clicking the trash button", () => {
    const removeButton = screen.getByLabelText("Remove selected list");

    fireEvent.click(removeButton);
    expect(removeList).toHaveBeenCalledWith("list-a");
    expect(setActiveList).toHaveBeenCalledWith(null);
  });
});
