export type Symbol = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
};

export type SymbolList = {
  id: string;
  name: string;
  symbols: Symbol[];
};
