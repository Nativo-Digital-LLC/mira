import type { UPSData } from '../hooks/useUPSData';

export function PowerBentoGrid({ data, parsed }: { data: UPSData | null; parsed: any }) {
  const linev = parsed.linev.toFixed(1);
  const lotrans = data?.LOTRANS ? parseFloat(data.LOTRANS).toFixed(1) : '88.0';
  const hitrans = data?.HITRANS ? parseFloat(data.HITRANS).toFixed(1) : '139.0';
  
  // Calculate percentage for progress bar (between LOTRANS and HITRANS)
  const low = parseFloat(lotrans);
  const high = parseFloat(hitrans);
  const current = parsed.linev;
  let pct = 50; // default middle
  if (high > low) {
    pct = ((current - low) / (high - low)) * 100;
    pct = Math.max(0, Math.min(100, pct));
  }

  const numTransfers = data?.NUMXFERS || '0';
  const timeOnBatt = data?.TONBATT || '0 Segundos';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Main Gauge Card */}
      <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-surface-container-low p-8 border-l-4 border-primary flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-tighter text-slate-500 mb-8">Voltaje de Entrada Transmisión Viva</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-8xl font-bold tracking-tighter tabular-nums leading-none">{linev}</span>
            <span className="font-headline text-2xl text-slate-500 font-medium">VAC</span>
          </div>
        </div>
        <div className="mt-12 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-slate-400">OBJETIVO NOMINAL</span>
            <span className="font-mono text-sm">120V</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className={`h-full shadow-[0_0_15px_rgba(119,221,109,0.5)] transition-all duration-500 ${pct < 10 || pct > 90 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-600">
            <span>{lotrans}V MIN</span>
            <span>{hitrans}V MAX</span>
          </div>
        </div>
      </div>

      {/* Transfer Thresholds */}
      <div className="bg-surface-container p-6 flex flex-col justify-between border-t border-outline-variant/5">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-primary/50" data-icon="keyboard_double_arrow_down">keyboard_double_arrow_down</span>
          <span className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-slate-400">CRÍTICO</span>
        </div>
        <div className="mt-4">
          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Transferencia Baja</div>
          <div className="font-headline text-3xl tabular-nums">{lotrans}<span className="text-sm text-slate-500 ml-1">V</span></div>
        </div>
      </div>
      <div className="bg-surface-container p-6 flex flex-col justify-between border-t border-outline-variant/5">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-tertiary/50" data-icon="keyboard_double_arrow_up">keyboard_double_arrow_up</span>
          <span className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-slate-400">CRÍTICO</span>
        </div>
        <div className="mt-4">
          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Transferencia Alta</div>
          <div className="font-headline text-3xl tabular-nums">{hitrans}<span className="text-sm text-slate-500 ml-1">V</span></div>
        </div>
      </div>

      {/* Transfer History Bento Items */}
      <div className="md:col-span-1 lg:col-span-1 bg-surface-container-low p-6 border-l-2 border-tertiary">
        <div className="text-[10px] text-slate-500 uppercase font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-xs" data-icon="history">history</span>
          Desde Encendido
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-2xl font-headline tabular-nums leading-none">{numTransfers}</div>
            <div className="text-[10px] text-slate-400 mt-1 uppercase font-medium">transferencias detectadas</div>
          </div>
          <div className="pt-4 border-t border-outline-variant/10">
            <div className="text-2xl font-headline tabular-nums leading-none">{timeOnBatt}</div>
            <div className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Tiempo Acumulado en Batería</div>
          </div>
        </div>
      </div>
      <div className="md:col-span-1 lg:col-span-1 glass-panel p-6 border border-outline-variant/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="material-symbols-outlined text-4xl text-primary mb-4" data-icon="policy">policy</span>
        <div className="text-sm font-bold text-on-surface">Configuración de Alarma</div>
        <div className="text-[10px] text-primary mt-1 uppercase font-black tracking-widest">{data?.ALARMDEL || 'Sin alarma'}</div>
      </div>
    </div>
  );
}
