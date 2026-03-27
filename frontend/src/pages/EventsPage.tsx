import type { UPSEvent } from '../hooks/useUPSData';
import { EventLog } from '../components/EventLog';

const EVENT_TYPES = [
  'TRANSFER_TO_BATTERY', 'TRANSFER_TO_LINE', 'STATUS_CHANGE',
  'POWER_TRANSFER', 'BATTERY_LOW', 'BATTERY_HALF', 'BATTERY_RECOVERED',
  'VOLTAGE_LOW', 'VOLTAGE_HIGH', 'SELF_TEST',
];

const TYPE_LABELS: Record<string, string> = {
  TRANSFER_TO_BATTERY: 'Batería',
  TRANSFER_TO_LINE: 'Línea',
  STATUS_CHANGE: 'Estado',
  POWER_TRANSFER: 'Transferencia',
  BATTERY_LOW: 'Bat. Baja',
  BATTERY_HALF: 'Bat. 50%',
  BATTERY_RECOVERED: 'Bat. OK',
  VOLTAGE_LOW: 'Volt. Bajo',
  VOLTAGE_HIGH: 'Volt. Alto',
  SELF_TEST: 'Auto-prueba',
};

interface Props {
  events: UPSEvent[];
}

export function EventsPage({ events }: Props) {
  const critical = events.filter(e => e.severity === 'critical').length;
  const warnings = events.filter(e => e.severity === 'warning').length;
  const info = events.filter(e => e.severity === 'info').length;

  return (
    <>
      <header className="flex flex-col mb-8 pb-4 border-b border-outline-variant/10">
        <h2 className="text-on-surface-variant font-headline text-sm tracking-tight mb-2">Registro de Eventos</h2>
        <p className="text-slate-500 text-xs">Alertas y eventos detectados automáticamente por el sistema de monitoreo</p>
      </header>

      {/* Severity summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-400/5 border border-red-400/20 p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-red-400 text-base" data-icon="error">error</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Críticos</p>
          </div>
          <p className="text-3xl font-headline font-bold text-red-400 mono-nums">{critical}</p>
        </div>
        <div className="bg-amber-400/5 border border-amber-400/20 p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-amber-400 text-base" data-icon="warning">warning</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Advertencias</p>
          </div>
          <p className="text-3xl font-headline font-bold text-amber-400 mono-nums">{warnings}</p>
        </div>
        <div className="bg-[#77dd6d]/5 border border-[#77dd6d]/20 p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#77dd6d] text-base" data-icon="check_circle">check_circle</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Informativos</p>
          </div>
          <p className="text-3xl font-headline font-bold text-[#77dd6d] mono-nums">{info}</p>
        </div>
      </div>

      {/* Event type breakdown pills */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {EVENT_TYPES.filter(t => events.some(e => e.type === t)).map(t => {
            const count = events.filter(e => e.type === t).length;
            return (
              <span key={t} className="text-[10px] font-bold bg-surface-container-low border border-outline-variant/10 px-2 py-1 rounded text-slate-400">
                {TYPE_LABELS[t] || t}: <span className="text-on-surface">{count}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Event log table */}
      <div className="bg-surface-container p-6 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-on-surface">
            Eventos Recientes
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">{events.length} total (máx 200)</span>
        </div>
        <EventLog events={events} />
      </div>
    </>
  );
}
