import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { symbolListColumns } from "./symbol-list-columns";
import { SymbolListTable } from "./symbol-list-table";
import * as reactVirtual from "@tanstack/react-virtual";

const data = [
  {
    symbol: "AAPL",
    lastPrice: "150",
    bidPrice: "149.5",
    askPrice: "150.5",
    priceChange: "1.2",
  },
  {
    symbol: "GOOG",
    lastPrice: "2800",
    bidPrice: "2795",
    askPrice: "2805",
    priceChange: "-0.8",
  },
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

describe("SymbolListTable", () => {
  test("renders table headers and rows", () => {
    render(<SymbolListTable columns={symbolListColumns} data={data} />);

    expect(screen.getByText("Symbol")).toBeInTheDocument();
    expect(screen.getByText("Last Price")).toBeInTheDocument();
    expect(screen.getByText("Bid Price")).toBeInTheDocument();
    expect(screen.getByText("Ask Price")).toBeInTheDocument();
    expect(screen.getByText("Price Change (%)")).toBeInTheDocument();

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("149.5")).toBeInTheDocument();
    expect(screen.getByText("150.5")).toBeInTheDocument();
    expect(screen.getByText("1.2%")).toBeInTheDocument();

    expect(screen.getByText("GOOG")).toBeInTheDocument();
    expect(screen.getByText("2800")).toBeInTheDocument();
    expect(screen.getByText("2795")).toBeInTheDocument();
    expect(screen.getByText("2805")).toBeInTheDocument();
    expect(screen.getByText("-0.8%")).toBeInTheDocument();
  });

  test("shows 'No results.' when data is empty", () => {
    render(<SymbolListTable columns={symbolListColumns} data={[]} />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders row with selected state when enableRowSelection and selected", () => {
    const options = {
      enableRowSelection: true,
      state: {
        rowSelection: { "0": true },
      },
      onRowSelectionChange: () => {},
    };

    render(
      <SymbolListTable
        columns={symbolListColumns}
        data={data}
        options={options}
      />,
    );

    const firstRow = screen.getByText("AAPL").closest("tr");
    expect(firstRow).toHaveAttribute("data-state", "selected");

    const secondRow = screen.getByText("GOOG").closest("tr");
    expect(secondRow).not.toHaveAttribute("data-state", "selected");
  });
});
