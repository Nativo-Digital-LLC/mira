import { useEffect, useState, useRef } from 'react';

export interface UPSData {
  STATUS?: string;
  BCHARGE?: string;
  TIMELEFT?: string;
  LINEV?: string;
  LOADPCT?: string;
  BATTV?: string;
  MODEL?: string;
  FIRMWARE?: string;
  TONBATT?: string;
  NOMINV?: string;
  HITRANS?: string;
  LOTRANS?: string;
  NOMPOWER?: string;
  LINEFREQ?: string;
  HOSTNAME?: string;
  LASTXFER?: string;
  NUMXFERS?: string;
  CUMONBATT?: string;
  XOFFBATT?: string;
  SELFTEST?: string;
  ALARMDEL?: string;
  SENSE?: string;
  APC?: string;
  DATE?: string;
  DRIVER?: string;
  UPSMODE?: string;
  UPSNAME?: string;
  SERIALNO?: string;
  BATTDATE?: string;
  NOMBATTV?: string;
  STATFLAG?: string;
  STARTTIME?: string;
  VERSION?: string;
  CABLE?: string;
  MBATTCHG?: string;
  MINTIMEL?: string;
  MAXTIME?: string;
  [key: string]: string | undefined;
}

export interface HistoryEntry {
  timestamp: number;
  bcharge: number;
  loadpct: number;
  linev: number;
  battv: number;
  timeleft: number;
  status: string;
}

export type EventSeverity = 'info' | 'warning' | 'critical';

export interface UPSEvent {
  id: number;
  timestamp: number;
  type: string;
  severity: EventSeverity;
  description: string;
  value?: string;
}

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:3001`;
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;

export function useUPSData() {
  const [data, setData] = useState<UPSData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [events, setEvents] = useState<UPSEvent[]>([]);
  const historyBootstrapped = useRef(false);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setConnected(true);
        setError(false);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // New typed protocol
          if (msg.type === 'status') {
            setData(msg.data as UPSData);
          } else if (msg.type === 'history') {
            setHistory(msg.data as HistoryEntry[]);
            historyBootstrapped.current = true;
          } else if (msg.type === 'history_update') {
            setHistory(prev => {
              const updated = [...prev, msg.data as HistoryEntry];
              if (updated.length > 1440) updated.shift();
              return updated;
            });
          } else if (msg.type === 'events') {
            setEvents(msg.data as UPSEvent[]);
          } else if (msg.type === 'event') {
            setEvents(prev => [msg.data as UPSEvent, ...prev].slice(0, 200));
          } else {
            // Legacy: backend might send raw status for backwards compat
            setData(msg as UPSData);
          }
        } catch (e) {
          console.error('Failed to parse UPS data', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setError(true);
      };
    };

    connect();

    // Fallback REST fetch if history not bootstrapped after 5s
    const historyFallbackTimeout = setTimeout(async () => {
      if (!historyBootstrapped.current) {
        try {
          const [histRes, evtRes] = await Promise.all([
            fetch(`${API_URL}/api/history`),
            fetch(`${API_URL}/api/events`),
          ]);
          if (histRes.ok) setHistory(await histRes.json());
          if (evtRes.ok) setEvents(await evtRes.json());
        } catch (e) {
          console.warn('REST fallback for history failed', e);
        }
      }
    }, 5000);

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
      clearTimeout(historyFallbackTimeout);
    };
  }, []);

  const parseValue = (val?: string) => val ? parseFloat(val) : 0;

  return {
    data,
    connected,
    error,
    history,
    events,
    parsed: {
      bcharge: parseValue(data?.BCHARGE),
      loadpct: parseValue(data?.LOADPCT),
      linev: parseValue(data?.LINEV),
      battv: parseValue(data?.BATTV),
      timeleft: parseValue(data?.TIMELEFT),
      nompower: parseValue(data?.NOMPOWER),
      isOnline: data?.STATUS?.includes('ONLINE') ?? false,
      isBattery: data?.STATUS?.includes('ONBATT') ?? false,
    }
  };
}
