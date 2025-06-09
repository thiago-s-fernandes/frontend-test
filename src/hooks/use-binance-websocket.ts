import { useCallback, useEffect, useMemo, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Symbol } from "@/@types/symbols";

interface TickerData {
  a: string; // Ask Price
  b: string; // Bid Price
  c: string; // Last price
  P: string; // Price change percent
  s: string; // Symbol
}

interface BinanceWebSocketMessage {
  stream: string;
  data: TickerData;
}

interface UseBinanceWebSocketProps {
  symbols: Symbol[];
}

interface UseBinanceWebSocketReturn {
  tickerData: Record<string, TickerData>;
  connectionStatus: string;
  isConnected: boolean;
  subscribe: (symbols: string[]) => void;
  subscribeAll: () => void;
}

export function useBinanceWebSocket({
  symbols,
}: UseBinanceWebSocketProps): UseBinanceWebSocketReturn {
  const shouldConnect = symbols.length > 0;
  const socketUrl = "wss://stream.binance.com:9443/stream";

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    shouldConnect ? socketUrl : null,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    },
  );

  const tickerDataRef = useRef<Record<string, TickerData>>({});
  const subscriptionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as BinanceWebSocketMessage;

      if (message.data && message.data.s) {
        tickerDataRef.current = {
          ...tickerDataRef.current,
          [message.data.s]: message.data,
        };
      }
    }
  }, [lastJsonMessage]);

  const subscribe = useCallback(
    (symbolsToSubscribe: string[]) => {
      if (readyState !== ReadyState.OPEN) return;

      const streams = symbolsToSubscribe
        .map((symbol) => `${symbol.toLowerCase()}@ticker`)
        .filter((stream) => !subscriptionsRef.current.has(stream));

      if (streams.length === 0) return;

      sendJsonMessage({
        method: "SUBSCRIBE",
        params: streams,
        id: Date.now(),
      });

      streams.forEach((stream) => subscriptionsRef.current.add(stream));
    },
    [sendJsonMessage, readyState],
  );

  const subscribeAll = useCallback(() => {
    const symbolNames = symbols.map((symbol) => symbol.symbol);
    subscribe(symbolNames);
  }, [symbols, subscribe]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && symbols.length > 0) {
      subscribeAll();
    }
  }, [readyState, symbols, subscribeAll]);

  const connectionStatus = useMemo(
    () =>
      ({
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
      })[readyState],
    [readyState],
  );

  const isConnected = readyState === ReadyState.OPEN;

  return {
    tickerData: tickerDataRef.current,
    connectionStatus,
    isConnected,
    subscribe,
    subscribeAll,
  };
}
