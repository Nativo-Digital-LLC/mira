import { Badge } from 'antd';

export function TopAppBar() {
  return (
    <header className="w-full top-0 sticky z-40 flex justify-between items-center px-6 py-3 bg-[#121416]">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#77dd6d] uppercase tracking-widest font-['Space_Grotesk'] pt-1">APC Smart-UPS</h1>
      </div>
      <div className="flex items-center gap-2">
        <Badge status="processing" color="#77dd6d" />
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Conectado</span>
      </div>
    </header>
  );
}
