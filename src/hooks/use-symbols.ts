import useSWR from "swr";
import { axiosFetcher } from "@/utils/axios-fetcher";
import type { Symbol } from "@/@types/symbols";

export function useSymbols() {
  const { data, error, isLoading } = useSWR<{ symbols: Symbol[] }>(
    "https://api.binance.com/api/v3/exchangeInfo",
    axiosFetcher,
  );

  const symbols: Symbol[] =
    data?.symbols?.map(({ symbol }: Symbol) => ({
      symbol,
    })) ?? [];

  return {
    symbols,
    isLoading,
    error,
  };
}
