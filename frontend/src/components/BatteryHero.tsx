import type { UPSData } from '../hooks/useUPSData';

export function BatteryHero({ data, parsed }: { data: UPSData | null; parsed: any }) {
  const charge = parsed.bcharge.toFixed(0);
  const runtime = data?.TIMELEFT ? parseFloat(data.TIMELEFT).toFixed(0) : '0';
  const battv = data?.BATTV ? parseFloat(data.BATTV).toFixed(1) : '0.0';
  const nombattv = data?.NOMBATTV ? parseFloat(data.NOMBATTV).toFixed(1) : '24.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Battery Charge & Runtime */}
      <div className="md:col-span-2 bg-surface-container p-6 rounded relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-[120px]" data-icon="battery_charging_full">battery_charging_full</span>
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">BCHARGE | TIMELEFT</span>
            <h3 className="text-2xl font-headline font-bold text-on-surface">Capacidad de Batería</h3>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Carga</p>
              <div className="text-6xl font-headline font-bold text-on-surface tracking-tighter mono-data">{charge}<span className="text-2xl text-primary-container">%</span></div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tiempo Restante</p>
              <div className="text-6xl font-headline font-bold text-on-surface tracking-tighter mono-data">{runtime}<span className="text-2xl text-primary-container">m</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Voltage Specs */}
      <div className="bg-surface-container-low p-6 rounded border-l-2 border-primary/40 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Voltaje en Tiempo Real (BATTV)</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-on-surface-variant font-label">Actual</span>
            <span className="text-2xl font-headline text-on-surface mono-data">{battv}<span className="text-sm text-slate-500 ml-1">V</span></span>
          </div>
          <div className="w-full bg-surface-container-highest h-[2px] my-4 relative">
            <div className={`absolute left-0 top-0 h-full w-[78%] ${parsed.bcharge < 20 ? 'bg-error' : 'bg-primary'}`}></div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-on-surface-variant font-label">Nominal (NOMBATTV)</span>
            <span className="text-lg font-headline text-slate-400 mono-data">{nombattv}<span className="text-xs text-slate-500 ml-1">V</span></span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-surface-container-lowest rounded-sm">
          <p className="text-[10px] text-primary font-bold uppercase">Estado</p>
          <p className="text-xs text-on-surface">Operando dentro del margen de seguridad</p>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-surface-container-low p-6 rounded flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Mantenimiento</span>
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Fecha de Batería (BATTDATE)</p>
              <p className="text-lg font-headline text-on-surface">{data?.BATTDATE || 'Desconocida'}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Última Autoprueba (SELFTEST)</p>
              {data?.SELFTEST === 'NO' ? (
                 <div className="inline-flex items-center gap-2 bg-error-container/20 px-2 py-0.5 rounded-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                   <span className="text-xs font-bold text-error uppercase tracking-wider">NO</span>
                 </div>
              ) : (
                 <div className="inline-flex items-center gap-2 bg-primary/20 px-2 py-0.5 rounded-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                   <span className="text-xs font-bold text-primary uppercase tracking-wider">{data?.SELFTEST || 'OK'}</span>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
