import type { UPSData } from '../hooks/useUPSData';
import { BatteryHero } from '../components/BatteryHero';
import { SystemRegistry } from '../components/SystemRegistry';
import { EventHistory } from '../components/EventHistory';

interface Props {
  data: UPSData | null;
  parsed: { bcharge: number; loadpct: number; linev: number; isOnline: boolean; isBattery: boolean };
  connected: boolean;
}

export function BatteryStatus({ data, parsed }: Props) {
  return (
    <>
      <header className="flex flex-col mb-8 pb-4 border-b border-outline-variant/10">
        <h2 className="text-on-surface-variant font-headline text-sm tracking-tight mb-2">Battery Health & Analysis</h2>
        <p className="text-slate-500 text-xs">Real-time deep diagnostics of the UPS battery array</p>
      </header>
      
      <div className="space-y-8">
        <BatteryHero data={data} parsed={parsed} />
        <SystemRegistry data={data} />
        <EventHistory data={data} />
      </div>
    </>
  );
}
