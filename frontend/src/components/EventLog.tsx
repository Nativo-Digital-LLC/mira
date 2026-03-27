import type { UPSEvent, EventSeverity } from '../hooks/useUPSData';

const severityConfig: Record<EventSeverity, { color: string; bg: string; icon: string; label: string }> = {
  info: { color: 'text-[#77dd6d]', bg: 'bg-[#77dd6d]/10', icon: 'check_circle', label: 'Info' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: 'warning', label: 'Advertencia' },
  critical: { color: 'text-red-400', bg: 'bg-red-400/10', icon: 'error', label: 'Crítico' },
};

const eventTypeLabels: Record<string, string> = {
  TRANSFER_TO_BATTERY: 'Transferencia a Batería',
  TRANSFER_TO_LINE: 'Restauración a Línea',
  STATUS_CHANGE: 'Cambio de Estado',
  POWER_TRANSFER: 'Transferencia de Energía',
  BATTERY_LOW: 'Batería Baja',
  BATTERY_HALF: 'Batería al 50%',
  BATTERY_RECOVERED: 'Batería Recuperada',
  VOLTAGE_LOW: 'Voltaje Bajo',
  VOLTAGE_HIGH: 'Voltaje Alto',
  SELF_TEST: 'Auto-prueba',
};

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString('es-DO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

interface Props {
  events: UPSEvent[];
  maxRows?: number;
}

export function EventLog({ events, maxRows }: Props) {
  const displayed = maxRows ? events.slice(0, maxRows) : events;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-slate-600 mb-4" data-icon="check_circle">check_circle</span>
        <p className="text-slate-500 font-medium">Sin eventos registrados</p>
        <p className="text-slate-600 text-xs mt-1">El sistema monitorea continuamente. Los eventos aparecerán aquí automáticamente.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-outline-variant/10">
            <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider w-40">Timestamp</th>
            <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tipo</th>
            <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider w-24">Severidad</th>
            <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">Descripción</th>
            <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider w-20">Valor</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((evt) => {
            const cfg = severityConfig[evt.severity];
            return (
              <tr
                key={evt.id}
                className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                  {formatTimestamp(evt.timestamp)}
                </td>
                <td className="px-3 py-2.5 font-medium text-on-surface-variant">
                  {eventTypeLabels[evt.type] || evt.type}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${cfg.color} ${cfg.bg}`}>
                    <span className="material-symbols-outlined text-[12px]" data-icon={cfg.icon}>{cfg.icon}</span>
                    {cfg.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-slate-300">{evt.description}</td>
                <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">{evt.value || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
