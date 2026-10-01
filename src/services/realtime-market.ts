import { API_CONFIG } from '@/constants';
import type { BackendHistoricalBar } from '@/services/backend';

export type MarketStreamStatus = 'LIVE' | 'DELAYED' | 'MARKET_CLOSED' | 'DATA_UNAVAILABLE';
export type MarketStreamInterval = '1m' | '5m' | '15m' | '30m' | '1h';

export interface MarketStreamEvent {
  symbol: string;
  status: MarketStreamStatus;
  timestamp?: string;
  price?: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  candle?: BackendHistoricalBar;
}

interface SharedStream {
  source: EventSource;
  listeners: Set<(event: MarketStreamEvent) => void>;
  statusListeners: Set<(status: MarketStreamStatus) => void>;
}

const sharedStreams = new Map<string, SharedStream>();

export function streamIntervalForTimeframe(timeframe: string): MarketStreamInterval | null {
  switch (timeframe) {
    case '1D': return '1m';
    case '5D': return '5m';
    case '1M': return '15m';
    case '3M': return '30m';
    case '6M':
    case 'YTD':
    case '1Y': return '1h';
    default: return null;
  }
}

export function subscribeToMarketStream(
  symbol: string,
  interval: MarketStreamInterval,
  onEvent: (event: MarketStreamEvent) => void,
  onStatus: (status: MarketStreamStatus) => void,
): () => void {
  const key = `${symbol.toUpperCase()}:${interval}`;
  let stream = sharedStreams.get(key);
  if (!stream) {
    const url = `${API_CONFIG.baseURL}/${API_CONFIG.version}/market/stream/${encodeURIComponent(symbol)}?interval=${interval}`;
    const source = new EventSource(url);
    stream = { source, listeners: new Set(), statusListeners: new Set() };
    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as MarketStreamEvent;
        if (event.status) stream?.statusListeners.forEach((listener) => listener(event.status));
        stream?.listeners.forEach((listener) => listener(event));
      } catch {
        stream?.statusListeners.forEach((listener) => listener('DATA_UNAVAILABLE'));
      }
    };
    source.onerror = () => {
      stream?.statusListeners.forEach((listener) => listener('DATA_UNAVAILABLE'));
    };
    sharedStreams.set(key, stream);
  }

  stream.listeners.add(onEvent);
  stream.statusListeners.add(onStatus);

  return () => {
    const current = sharedStreams.get(key);
    if (!current) return;
    current.listeners.delete(onEvent);
    current.statusListeners.delete(onStatus);
    if (current.listeners.size === 0) {
      current.source.close();
      sharedStreams.delete(key);
    }
  };
}
