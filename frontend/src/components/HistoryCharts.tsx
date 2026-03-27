import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { HistoryEntry } from '../hooks/useUPSData';

interface Props {
  history: HistoryEntry[];
  range: number; // hours
}

const COLORS = {
  bcharge: '#77dd6d',
  loadpct: '#60a5fa',
  linev: '#f59e0b',
  battv: '#a78bfa',
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1c1e] border border-[#3f4a3b]/30 rounded px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

const chartConfig = [
  {
    key: 'bcharge' as keyof HistoryEntry,
    label: 'Carga de Batería (%)',
    color: COLORS.bcharge,
    unit: '%',
    domain: [0, 100] as [number, number],
    references: [{ value: 20, color: '#ef4444', label: 'Crítico 20%' }],
  },
  {
    key: 'loadpct' as keyof HistoryEntry,
    label: 'Carga del Sistema (%)',
    color: COLORS.loadpct,
    unit: '%',
    domain: [0, 100] as [number, number],
    references: [{ value: 80, color: '#f59e0b', label: 'Advertencia 80%' }],
  },
  {
    key: 'linev' as keyof HistoryEntry,
    label: 'Voltaje de Línea (VAC)',
    color: COLORS.linev,
    unit: 'V',
    domain: ['auto', 'auto'] as ['auto', 'auto'],
    references: [
      { value: 88, color: '#ef4444', label: 'Mín 88V' },
      { value: 139, color: '#ef4444', label: 'Máx 139V' },
    ],
  },
  {
    key: 'battv' as keyof HistoryEntry,
    label: 'Voltaje de Batería (V)',
    color: COLORS.battv,
    unit: 'V',
    domain: ['auto', 'auto'] as ['auto', 'auto'],
    references: [],
  },
];

export function HistoryCharts({ history, range }: Props) {
  const cutoff = Date.now() - range * 60 * 60 * 1000;
  const filtered = history.filter(e => e.timestamp >= cutoff);

  const chartData = filtered.map(e => ({
    ...e,
    time: formatTime(e.timestamp),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-slate-600 mb-4" data-icon="history">history</span>
        <p className="text-slate-500 font-medium">Sin datos históricos aún</p>
        <p className="text-slate-600 text-xs mt-1">Los datos se registran automáticamente cada 1 minuto. Vuelve pronto.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {chartConfig.map((cfg) => {
        const values = chartData.map(d => d[cfg.key] as number);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return (
          <div key={cfg.key} className="bg-surface-container-low p-6 rounded-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-sm font-bold text-on-surface">{cfg.label}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{chartData.length} puntos de datos</p>
              </div>
              <div className="flex gap-4 text-[10px] font-mono text-right">
                <div>
                  <div className="text-slate-500 uppercase font-bold">Prom</div>
                  <div className="text-on-surface font-bold" style={{ color: cfg.color }}>{avg.toFixed(1)}{cfg.unit}</div>
                </div>
                <div>
                  <div className="text-slate-500 uppercase font-bold">Máx</div>
                  <div className="text-on-surface font-bold">{max.toFixed(1)}{cfg.unit}</div>
                </div>
                <div>
                  <div className="text-slate-500 uppercase font-bold">Mín</div>
                  <div className="text-on-surface font-bold">{min.toFixed(1)}{cfg.unit}</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,74,59,0.15)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'Space Grotesk' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={cfg.domain}
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'Space Grotesk' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {cfg.references.map(ref => (
                  <ReferenceLine
                    key={ref.value}
                    y={ref.value}
                    stroke={ref.color}
                    strokeDasharray="4 2"
                    strokeOpacity={0.5}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey={cfg.key}
                  name={cfg.label}
                  stroke={cfg.color}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, fill: cfg.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
