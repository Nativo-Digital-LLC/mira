import { HeroHeader } from '../components/HeroHeader';
import { DashboardMetrics } from '../components/DashboardMetrics';
import { SparklineCard } from '../components/SparklineCard';
import type { UPSData, HistoryEntry } from '../hooks/useUPSData';

interface Props {
  data: UPSData | null;
  parsed: {
    bcharge: number;
    loadpct: number;
    linev: number;
    battv: number;
    timeleft: number;
    nompower: number;
    isOnline: boolean;
    isBattery: boolean;
  };
  connected: boolean;
  history: HistoryEntry[];
}

export function Dashboard({ data, parsed, connected, history }: Props) {
  const estimatedWatts = ((parsed.loadpct / 100) * parsed.nompower).toFixed(0);
  const nompower = parsed.nompower > 0 ? parsed.nompower : 900;

  // Last 30 min of history
  const cutoff30 = Date.now() - 30 * 60 * 1000;
  const recent = history.filter(e => e.timestamp >= cutoff30);

  return (
    <>
      <HeroHeader data={data} parsed={parsed} connected={connected} />
      <DashboardMetrics
        bcharge={parsed.bcharge}
        loadpct={parsed.loadpct}
        linev={parsed.linev}
        sense={data?.SENSE || 'Unknown'}
      />

      {/* Sparklines Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estimated Power */}
        <div className="bg-surface-container-low p-6 rounded-sm border-l-4 border-amber-400/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-4">Consumo Estimado</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-bold mono-nums text-amber-400">{estimatedWatts}</span>
              <span className="text-lg font-light text-slate-500">W</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {parsed.loadpct.toFixed(1)}% de {nompower}W nominales
            </p>
          </div>
          <div className="mt-4 w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
            <div
              className="h-full transition-all duration-1000 bg-amber-400"
              style={{ width: `${Math.min(parsed.loadpct, 100)}%` }}
            />
          </div>
        </div>

        {/* Load sparkline */}
        <div className="md:col-span-2">
          <SparklineCard
            title="Carga del Sistema — últimos 30 min"
            data={recent}
            dataKey="loadpct"
            color="#60a5fa"
            unit="%"
            currentValue={parsed.loadpct}
          />
        </div>
      </div>
    </>
  );
}
