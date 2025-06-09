export type Symbol = {
  symbol: string;
  lastPrice?: string;
  bidPrice?: string;
  askPrice?: string;
  priceChange?: string;
};

export type SymbolList = {
  id: string;
  name: string;
  symbols: Symbol[];
};
