import { render, screen, fireEvent } from "@testing-library/react";
import { SymbolSelector } from "./symbol-selector";
import { vi, describe, beforeEach, expect, test } from "vitest";
import * as useSymbolsContextHook from "@/hooks/use-symbols-context";
import * as reactVirtual from "@tanstack/react-virtual";
import type { Symbol } from "@/@types/symbols";

const data: Symbol[] = [
  { symbol: "AAPL" },
  { symbol: "GOOG" },
  { symbol: "MSFT" },
];

vi.mock("@/hooks/use-symbols-context", async () => {
  const actual = await vi.importActual<typeof useSymbolsContextHook>(
    "@/hooks/use-symbols-context",
  );

  return {
    ...actual,
    useSymbolsContext: vi.fn(),
  };
});

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

describe("SymbolSelector", () => {
  beforeEach(() => {
    vi.mocked(useSymbolsContextHook.useSymbolsContext).mockReturnValue({
      symbols: data,
      isLoading: false,
      error: undefined,
    });
  });

  test("renders symbols and toggles selection", () => {
    render(<SymbolSelector />);

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("GOOG")).toBeInTheDocument();
    expect(screen.getByText("MSFT")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", {
      name: /select symbol AAPL/i,
    });

    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
  });

  test("renders skeletons while loading", () => {
    vi.mocked(useSymbolsContextHook.useSymbolsContext).mockReturnValue({
      symbols: data,
      isLoading: true,
      error: undefined,
    });

    render(<SymbolSelector />);

    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`loading-${i}`)).toBeInTheDocument();
    }
  });
});
