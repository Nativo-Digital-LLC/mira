import type { UPSData } from '../hooks/useUPSData';

export function SystemDetails({ data }: { data: UPSData | null }) {
  return (
    <section className="grid grid-cols-1 gap-6">
      <div className="bg-surface-container p-8 rounded-sm">
        <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" data-icon="memory">memory</span>
            Arquitectura del Sistema
          </h3>
          <p className="text-sm text-slate-500">Variables de contexto del hardware y metadatos de red</p>
        </div>
        <div className="px-3 py-1 bg-surface-container-highest rounded-sm border border-outline-variant/10">
          <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {data?.APC || '000,000,0000'}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-surface-container-low border border-outline-variant/5 rounded-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Detalles Operativos</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Estado</span>
              <span className={`text-xs font-mono font-bold ${typeof data?.STATUS === 'string' && data.STATUS.trim() === 'ONLINE' ? 'text-primary' : 'text-error'}`}>{data?.STATUS || 'OFFLINE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Fecha Interna</span>
              <span className="text-[10px] font-mono text-on-surface">{data?.DATE || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low border border-outline-variant/5 rounded-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Enlace de Red</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Nombre del Host</span>
              <span className="text-[10px] font-mono text-on-surface">{data?.HOSTNAME || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Puerto de Conexión</span>
              <span className="text-xs font-mono text-on-surface">3551 <span className="text-[8px] text-slate-500">TCP</span></span>
            </div>
          </div>
        </div>
      </div>
     </div>
    </section>
  );
}

import { useUPSData } from '../hooks/useUPSData';

export function Footer() {
  const { data } = useUPSData();
  const year = data?.DATE ? data.DATE.substring(0,4) : new Date().getFullYear();
  const time = data?.DATE ? data.DATE.split(' ')[1] + ' HORA UPS' : 'SINCRONIZANDO...';

  return (
    <footer className="w-full bottom-0 sticky z-40 bg-[#121416] flex justify-between items-center px-6 py-2 border-t border-[#3f4a3b]/10">
      <div className="font-['Space_Grotesk'] text-[10px] uppercase tracking-tighter text-slate-600">
        &copy; {year} Controlador APC
      </div>
      <div className="flex gap-6">
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-tighter text-slate-600 hover:text-[#77dd6d] cursor-pointer">
          {data?.HOSTNAME || 'lnd-swarm-manager'}
        </span>
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-tighter text-slate-600 hover:text-[#77dd6d] cursor-pointer hidden sm:block">
          {data?.FIRMWARE || 'NO-FIRMWARE-DATA'}
        </span>
        <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-tighter text-[#77dd6d]">
          {time}
        </span>
      </div>
    </footer>
  );
}
