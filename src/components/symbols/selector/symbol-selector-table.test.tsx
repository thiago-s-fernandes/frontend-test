import { render, screen, fireEvent } from "@testing-library/react";
import { SymbolSelectorColumns } from "./symbol-selector-columns";
import { SymbolSelectorTable } from "./symbol-selector-table";
import { vi, describe, test, expect } from "vitest";
import * as reactVirtual from "@tanstack/react-virtual";
import type { Symbol } from "@/@types/symbols";

const data: Symbol[] = [
  { symbol: "AAPL" },
  { symbol: "AOOG" },
  { symbol: "MSFT" },
];

vi.mock("@tanstack/react-virtual", () => {
  const original = vi.importActual<typeof reactVirtual>(
    "@tanstack/react-virtual",
  );
  return {
    ...original,
    useVirtualizer: vi.fn(() => ({
      getVirtualItems: () =>
        data.map((_, i) => ({ index: i, start: 0, size: 48 })),
      getTotalSize: () => data.length * 48,
    })),
  };
});

describe("SymbolSelectorTable", () => {
  test("renders search input", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  test("renders all rows initially", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("AOOG")).toBeInTheDocument();
    expect(screen.getByText("MSFT")).toBeInTheDocument();
  });

  test("filters rows with exact match when typing in search input", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "AAP" } });

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.queryByText("AOOG")).not.toBeInTheDocument();
    expect(screen.queryByText("MSFT")).not.toBeInTheDocument();
  });

  test("filters rows with partial match when typing in search input", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "A" } });

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("AOOG")).toBeInTheDocument();
    expect(screen.queryByText("MSFT")).not.toBeInTheDocument();
  });

  test("shows 'No results.' when filter matches nothing", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "XYZ" } });

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders empty state when no data is passed", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={[]} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders all symbol checkboxes as unchecked initially", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(4);

    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    }
  });

  test("select all checkbox toggles all symbol checkboxes", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);

    const checkboxes = screen.getAllByRole("checkbox");
    const symbolCheckboxes = checkboxes.filter((item) =>
      item.getAttribute("aria-label")?.includes("Select symbol"),
    );
    const selectAllCheckbox = checkboxes.find((item) =>
      item.getAttribute("aria-label")?.includes("Select all"),
    );

    symbolCheckboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    expect(selectAllCheckbox).toBeVisible();
    fireEvent.click(selectAllCheckbox!);

    symbolCheckboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    fireEvent.click(selectAllCheckbox!);

    symbolCheckboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });
  });

  test("toggles checkbox state on click", () => {
    render(<SymbolSelectorTable columns={SymbolSelectorColumns} data={data} />);

    const checkbox = screen.getByLabelText("Select symbol AAPL");

    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    fireEvent.click(checkbox);

    expect(checkbox).toHaveAttribute("data-state", "checked");

    fireEvent.click(checkbox);

    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });
});
