import type { UPSData } from '../hooks/useUPSData';
import { PowerHero } from '../components/PowerHero';
import { PowerBentoGrid } from '../components/PowerBentoGrid';
import { PowerStatusViz } from '../components/PowerStatusViz';

interface Props {
  data: UPSData | null;
  parsed: { bcharge: number; loadpct: number; linev: number; isOnline: boolean; isBattery: boolean };
  connected: boolean;
}

export function PowerStatistics({ data, parsed }: Props) {
  return (
    <>
      <PowerHero data={data} parsed={parsed} />
      <PowerBentoGrid data={data} parsed={parsed} />
      <PowerStatusViz data={data} parsed={parsed} />
    </>
  );
}
