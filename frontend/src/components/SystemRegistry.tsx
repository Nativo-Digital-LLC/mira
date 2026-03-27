import type { UPSData } from '../hooks/useUPSData';

export function SystemRegistry({ data }: { data: UPSData | null }) {
  const minBatt = data?.MBATTCHG || '5 Percent';
  const minTime = data?.MINTIMEL || '3 Minutes';
  const alarmDelay = data?.ALARMDEL || 'No alarm';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Data Table View */}
      <div className="lg:col-span-2 bg-surface-container p-8 rounded min-h-[400px] flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface">Valores del Sistema (Registro)</h3>
            <p className="text-sm text-slate-500">Datos operativos en bruto del controlador UPS</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">BCHARGE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">{data?.BCHARGE ? parseFloat(data.BCHARGE).toFixed(1) : '0.0'}</span>
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">TIMELEFT</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">{data?.TIMELEFT ? parseFloat(data.TIMELEFT).toFixed(1) : '0.0'}</span>
              <span className="text-sm text-slate-500">Minutes</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">BATTV</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">{data?.BATTV ? parseFloat(data.BATTV).toFixed(1) : '0.0'}</span>
              <span className="text-sm text-slate-500">VDC</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">NOMBATTV</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">{data?.NOMBATTV ? parseFloat(data.NOMBATTV).toFixed(1) : '24.0'}</span>
              <span className="text-sm text-slate-500">VDC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Config (Read Only) */}
      <div className="space-y-6">
        <div className="bg-surface-container-low p-6 rounded border border-outline-variant/5 shadow-xl">
          <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="tune">tune</span>
            Parámetros de Seguridad
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-medium text-slate-400">Carga Mínima de Batería (MBATTCHG)</label>
              </div>
              <div className="w-full bg-surface-container-highest rounded p-3 border border-outline-variant/10">
                <span className="text-lg font-headline font-bold text-primary mono-data">{minBatt}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">Activa el apagado seguro de los equipos conectados.</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-medium text-slate-400">Tiempo Mínimo Restante (MINTIMEL)</label>
              </div>
              <div className="w-full bg-surface-container-highest rounded p-3 border border-outline-variant/10">
                <span className="text-lg font-headline font-bold text-primary mono-data">{minTime}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">Margen de tiempo estimado antes de cortar la energía.</p>
            </div>
          </div>
        </div>

        {/* Quick Action Card Repurposed to Diagnostics */}
        <div className="glass-panel p-6 rounded border border-primary/10 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <span className="material-symbols-outlined text-8xl" data-icon="shield">shield</span>
          </div>
          <h4 className="text-xs font-bold text-on-surface mb-2 uppercase">Estado de Alarma (ALARMDEL)</h4>
          <p className="text-xs text-primary font-mono leading-relaxed truncate">{alarmDelay}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] text-slate-400 uppercase font-black">Enlace Establecido</span>
          </div>
        </div>
      </div>
    </div>
  );
}
