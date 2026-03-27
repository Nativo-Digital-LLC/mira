import { useState } from 'react';
import type { HistoryEntry } from '../hooks/useUPSData';
import { HistoryCharts } from '../components/HistoryCharts';

const RANGES = [
  { label: '1 hora', value: 1 },
  { label: '6 horas', value: 6 },
  { label: '12 horas', value: 12 },
  { label: '24 horas', value: 24 },
];

interface Props {
  history: HistoryEntry[];
}

export function HistoryPage({ history }: Props) {
  const [range, setRange] = useState(6);

  const cutoff = Date.now() - range * 60 * 60 * 1000;
  const filtered = history.filter(e => e.timestamp >= cutoff);

  // Uptime percentage (ONLINE status)
  const onlineCount = filtered.filter(e => e.status.includes('ONLINE')).length;
  const uptime = filtered.length > 0 ? ((onlineCount / filtered.length) * 100).toFixed(1) : '—';

  // Avg load
  const avgLoad = filtered.length > 0
    ? (filtered.reduce((a, b) => a + b.loadpct, 0) / filtered.length).toFixed(1)
    : '—';

  // Min battery
  const minBat = filtered.length > 0
    ? Math.min(...filtered.map(e => e.bcharge)).toFixed(1)
    : '—';

  return (
    <>
      <header className="flex flex-col mb-8 pb-4 border-b border-outline-variant/10">
        <h2 className="text-on-surface-variant font-headline text-sm tracking-tight mb-2">Historial de Datos</h2>
        <p className="text-slate-500 text-xs">Métricas históricas registradas cada 1 minuto — últimas {range} horas</p>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-low p-4 rounded-sm border border-outline-variant/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Disponibilidad</p>
          <p className="text-2xl font-headline font-bold text-[#77dd6d] mono-nums">{uptime}<span className="text-sm font-normal text-slate-500 ml-1">%</span></p>
          <p className="text-[10px] text-slate-600 mt-1">{filtered.length} registros analizados</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-sm border border-outline-variant/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Carga Promedio</p>
          <p className="text-2xl font-headline font-bold text-blue-400 mono-nums">{avgLoad}<span className="text-sm font-normal text-slate-500 ml-1">%</span></p>
          <p className="text-[10px] text-slate-600 mt-1">del período seleccionado</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-sm border border-outline-variant/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Batería Mínima</p>
          <p className="text-2xl font-headline font-bold mono-nums" style={{ color: parseFloat(minBat) < 20 ? '#ef4444' : '#e2e2e5' }}>
            {minBat}<span className="text-sm font-normal text-slate-500 ml-1">%</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-1">carga más baja registrada</p>
        </div>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              range === r.value
                ? 'bg-[#77dd6d]/20 text-[#77dd6d] border border-[#77dd6d]/40'
                : 'bg-surface-container-low text-slate-500 border border-outline-variant/10 hover:text-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}
        <div className="ml-auto text-[10px] text-slate-600 self-center font-mono">
          {filtered.length} / {history.length} entradas mostradas
        </div>
      </div>

      {/* Charts */}
      <HistoryCharts history={history} range={range} />
    </>
  );
}
