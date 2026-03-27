import type { UPSData } from '../hooks/useUPSData';

export function EventHistory({ data }: { data: UPSData | null }) {
  const lastxfer = data?.LASTXFER || 'No transfers recorded';
  const numxfers = data?.NUMXFERS || '0';
  const tonbatt = data?.TONBATT || '0 Seconds';
  const cumonbatt = data?.CUMONBATT || '0 Seconds';
  const xoffbatt = data?.XOFFBATT || 'N/A';

  return (
    <div className="bg-surface-container p-6 rounded">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-headline font-bold text-on-surface">Diagnósticos de Transferencia</h3>
        <span className="text-xs text-primary font-bold uppercase flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-sm">
          <span className="material-symbols-outlined text-sm" data-icon="sync_alt">sync_alt</span>
          {numxfers} Transferencias Totales
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Last Transfer Reason */}
        <div className="lg:col-span-2 p-4 bg-surface-container-low border border-outline-variant/10 rounded">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Motivo de Última Transferencia (LASTXFER)</p>
          <p className="text-sm font-label text-on-surface-variant break-words">{lastxfer}</p>
        </div>

        {/* Time On Battery */}
        <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Tiempo en Batería (TONBATT)</p>
          <p className="text-xl font-headline font-bold text-on-surface mono-data">{tonbatt}</p>
        </div>

        {/* Cumulative Time On Battery */}
        <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Tiempo Acumulado (CUMONBATT)</p>
          <p className="text-xl font-headline font-bold text-on-surface mono-data">{cumonbatt}</p>
        </div>

        {/* Time Off Battery */}
        <div className="lg:col-span-4 p-4 bg-surface-container-highest border-l-2 border-primary/50 rounded flex items-center justify-between mt-2">
          <p className="text-[10px] font-black text-slate-400 uppercase">Restaurado a Línea Eléctrica (XOFFBATT)</p>
          <p className="text-sm font-mono text-on-surface">{xoffbatt}</p>
        </div>
      </div>
    </div>
  );
}
