import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SymbolList } from "./symbol-list";
import { useBinanceWebSocket } from "@/hooks/use-binance-websocket";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";

vi.mock("@/lib/zustand/stores/symbol-list-store", () => ({
  useSymbolListsStore: vi.fn(),
}));

vi.mock("@/hooks/use-binance-websocket", () => ({
  useBinanceWebSocket: vi.fn(),
}));

describe("SymbolList component", () => {
  test("renders symbols with updated ticker data", () => {
    const symbols = [{ symbol: "BTCUSDT" }, { symbol: "ETHUSDT" }];

    (
      useSymbolListsStore as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      getActiveList: () => ({
        symbols,
      }),
    });

    (
      useBinanceWebSocket as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      tickerData: {
        BTCUSDT: { c: "30000", a: "30010", b: "29990", P: "2.5" },
        ETHUSDT: { c: "2000", a: "2010", b: "1995", P: "-1.3" },
      },
    });

    render(<SymbolList />);

    expect(screen.getByText("BTCUSDT")).toBeInTheDocument();
    expect(screen.getByText("30000")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("-1.3%")).toBeInTheDocument();
  });

  test("renders empty when no active list", () => {
    (
      useSymbolListsStore as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      getActiveList: () => null,
    });

    (
      useBinanceWebSocket as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      tickerData: {},
    });

    render(<SymbolList />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
