import type { UPSData } from '../hooks/useUPSData';

export function PowerStatusViz({ data, parsed }: { data: UPSData | null; parsed: any }) {
  const isOnline = parsed.isOnline;
  const linev = parsed.linev.toFixed(1);
  const lotrans = data?.LOTRANS ? parseFloat(data.LOTRANS).toFixed(0) : '88';
  const hitrans = data?.HITRANS ? parseFloat(data.HITRANS).toFixed(0) : '139';
  const nominv = data?.NOMINV ? parseFloat(data.NOMINV).toFixed(0) : '120';

  return (
    <div className="bg-surface-container-low p-8 border border-outline-variant/10 mt-8 rounded">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Estado de Voltaje</h3>
          <p className="text-xs text-slate-500 font-body">Captura actual de calidad de entrada</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase rounded-sm border border-outline-variant/20 ${isOnline ? 'text-primary' : 'text-tertiary'}`}>
            Monitoreo en Vivo
          </span>
        </div>
      </div>

      <div className="h-48 w-full relative flex items-center justify-center border border-outline-variant/5 bg-surface-container-lowest/30 rounded-sm">
        {/* Simple Real-time Snapshot Visualization */}
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center z-10">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Fuente de Entrada</div>
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${isOnline ? 'border-primary' : 'border-error'}`}>
              <span className={`material-symbols-outlined ${isOnline ? 'text-primary' : 'text-error'}`} style={{ fontVariationSettings: "'FILL' 1" }}>power</span>
            </div>
            <div className={`mt-2 text-xs font-mono ${isOnline ? 'text-primary' : 'text-error'}`}>
              {isOnline ? 'LÍNEA ACTIVA' : 'FALLA ELÉCTRICA'}
            </div>
          </div>

          <div className={`h-px w-32 relative ${isOnline ? 'bg-gradient-to-r from-primary to-primary/20' : 'bg-gradient-to-r from-error to-error/20'}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-surface-container-highest border border-outline-variant/20 rounded-full text-[10px] font-mono whitespace-nowrap z-10">
              {linev}V
            </div>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Carga del UPS</div>
            <div className="w-16 h-16 rounded-full border-2 border-outline-variant/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500">desktop_windows</span>
            </div>
            <div className="mt-2 text-xs font-mono text-slate-400">NOMINAL</div>
          </div>
        </div>

        {/* Reference Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 w-full">
          <div className="w-full flex justify-between items-center opacity-30">
            <div className="h-px flex-1 bg-outline-variant/20"></div>
            <span className="text-[8px] text-slate-600 px-2 font-mono">{hitrans}V HITRANS</span>
          </div>
          <div className="w-full flex justify-between items-center translate-y-2">
            <div className={`h-px flex-1 border-t border-dashed ${isOnline ? 'border-primary/20 bg-primary/20' : 'border-tertiary/20 bg-tertiary/20'}`}></div>
            <span className={`text-[8px] px-2 font-mono ${isOnline ? 'text-primary/50' : 'text-tertiary/50'}`}>{nominv}V NOMINV</span>
          </div>
          <div className="w-full flex justify-between items-center opacity-30">
            <div className="h-px flex-1 bg-outline-variant/20"></div>
            <span className="text-[8px] text-slate-600 px-2 font-mono">{lotrans}V LOTRANS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
