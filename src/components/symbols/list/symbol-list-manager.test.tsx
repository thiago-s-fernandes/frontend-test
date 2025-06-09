import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SymbolListManager } from "./symbol-list-manager";
import { toast } from "sonner";
import { vi, describe, beforeEach, test, expect } from "vitest";
import * as zustandStore from "@/lib/zustand/stores/symbol-list-store";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockSetActiveList = vi.fn();
const mockAddList = vi.fn();
const mockRemoveList = vi.fn();

vi.mock("@/lib/zustand/stores/symbol-list-store", () => ({
  useSymbolListsStore: vi.fn(),
}));

describe("SymbolListManager", () => {
  beforeEach(() => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValue({
      lists: [
        { id: "1", name: "List One" },
        { id: "2", name: "List Two" },
      ],
      activeListId: "1",
      setActiveList: mockSetActiveList,
      addList: mockAddList,
      removeList: mockRemoveList,
    });

    vi.mocked(toast.error).mockClear();
    mockSetActiveList.mockClear();
    mockAddList.mockClear();
    mockRemoveList.mockClear();
  });

  test("renders lists and allows changing active list", () => {
    render(<SymbolListManager />);

    expect(screen.getByText("List One")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("combobox"));

    const option = screen.getByText("List Two");
    fireEvent.click(option);

    expect(mockSetActiveList).toHaveBeenCalledWith("2");
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
    mockAddList.mockReturnValue("3");

    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Open modal add list"));

    fireEvent.change(screen.getByPlaceholderText("e.g. List A"), {
      target: { value: "My New List" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add list/i }));

    await waitFor(() => {
      expect(mockAddList).toHaveBeenCalledWith("My New List");

      expect(mockSetActiveList).toHaveBeenCalledWith("3");

      expect(
        screen.queryByPlaceholderText("e.g. List A"),
      ).not.toBeInTheDocument();
    });
  });

  test("removes active list", () => {
    render(<SymbolListManager />);

    fireEvent.click(screen.getByLabelText("Remove selected list"));

    expect(mockRemoveList).toHaveBeenCalledWith("1");
    expect(mockSetActiveList).toHaveBeenCalledWith(null);
  });

  test("shows toast error if no active list when removing", () => {
    vi.mocked(zustandStore.useSymbolListsStore).mockReturnValueOnce({
      lists: [{ id: "1", name: "List One" }],
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
