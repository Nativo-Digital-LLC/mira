import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { HistoryEntry } from '../hooks/useUPSData';

interface Props {
  title: string;
  data: HistoryEntry[];
  dataKey: keyof HistoryEntry;
  color: string;
  unit: string;
  currentValue: number;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function MiniTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1c1e] border border-[#3f4a3b]/30 rounded px-2 py-1 text-[10px] shadow-xl">
      <span className="text-slate-500">{label} → </span>
      <span className="font-bold" style={{}}>{payload[0].value.toFixed(1)}</span>
    </div>
  );
}

export function SparklineCard({ title, data, dataKey, color, unit, currentValue }: Props) {
  const chartData = data.map(e => ({ ...e, time: formatTime(e.timestamp) }));
  const values = data.map(e => e[dataKey] as number);
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;

  return (
    <div className="bg-surface-container-low p-6 rounded-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">{title}</p>
        <div className="flex gap-4 text-[10px] font-mono text-right">
          <span className="text-slate-500">prom <span className="text-on-surface font-bold">{avg.toFixed(1)}{unit}</span></span>
          <span className="text-slate-500">máx <span className="text-on-surface font-bold">{max.toFixed(1)}{unit}</span></span>
        </div>
      </div>
      <div className="flex items-end gap-4 mb-3">
        <span className="text-4xl font-headline font-bold mono-nums" style={{ color }}>{currentValue.toFixed(1)}</span>
        <span className="text-base font-light text-slate-500 mb-1">{unit}</span>
        <span className="text-[10px] text-slate-600 mb-1">{data.length > 0 ? `${data.length} puntos` : 'sin datos aún'}</span>
      </div>
      <div className="flex-1 min-h-[80px]">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <Tooltip content={<MiniTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey as string}
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 2, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-slate-600">
            Sin datos históricos aún — primer snapshot en ~1 min
          </div>
        )}
      </div>
    </div>
  );
}
