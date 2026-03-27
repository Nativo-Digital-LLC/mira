import type { UPSData } from '../hooks/useUPSData';

interface Props {
  data: UPSData | null;
  parsed: {
    bcharge: number;
    isOnline: boolean;
  };
  connected: boolean;
}

export function HeroHeader({ data, parsed, connected }: Props) {
  const model = data?.MODEL || 'Desconocido';
  const isOnline = parsed.isOnline;
  
  return (
    <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {connected ? (
            <span className={`px-3 py-0.5 text-[10px] font-black ${isOnline ? 'bg-primary-container/40 text-primary-fixed border-outline-variant/20' : 'bg-red-500/20 text-red-400 border-red-500/20'} border rounded-sm uppercase tracking-widest flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-primary' : 'bg-red-500'} animate-pulse`}></span>
              {data?.STATUS || (isOnline ? 'ONLINE' : 'ON BATTERY')}
            </span>
          ) : (
            <span className="px-3 py-0.5 text-[10px] font-black bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-sm uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              OFFLINE
            </span>
          )}
          
          <span className="text-on-surface-variant text-xs font-mono uppercase tracking-tighter">
            Serial: {data?.SERIALNO || 'N/A'}
          </span>
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-headline font-bold tracking-tight text-white leading-none">
          {model}
        </h2>
        
        <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-widest">
          FW: {data?.FIRMWARE || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 lg:text-right">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tiempo Restante</p>
          <p className="text-3xl font-headline font-medium mono-nums text-primary">
            {data?.TIMELEFT ? parseFloat(data.TIMELEFT).toFixed(1) : '0.0'} <span className="text-sm uppercase">{data?.TIMELEFT?.includes('Seconds') ? 'secs' : 'mins'}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Estado</p>
          <p className={`text-3xl font-headline font-medium mono-nums uppercase ${connected ? 'text-white' : 'text-slate-500'}`}>
            {connected ? (isOnline ? 'Online' : 'Battery') : 'Offline'}
          </p>
        </div>
      </div>
    </section>
  );
}
