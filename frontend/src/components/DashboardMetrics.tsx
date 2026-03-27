interface Props {
  bcharge: number;
  loadpct: number;
  linev: number;
  sense: string;
}

export function DashboardMetrics({ bcharge, loadpct, linev, sense }: Props) {
  
  // Progress calculations for the battery arc
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Offset = circumference - (percent / 100 * circumference)
  const offset = circumference - (bcharge / 100) * circumference;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Battery Charge Gauge */}
      <div className="bg-surface-container-low p-8 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl" data-icon="battery_horiz_075">battery_horiz_075</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-10">Carga de Batería</p>
        
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-secondary-container" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary glow-primary transition-all duration-1000 ease-out" 
                cx="80" cy="80" fill="transparent" r="70" 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                strokeWidth="12"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-headline font-bold mono-nums">{bcharge.toFixed(1)}<span className="text-base font-light text-slate-400">%</span></span>
              <span className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">{bcharge > 80 ? 'Estable' : bcharge > 20 ? 'Drenando' : 'Crítico'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Load Percentage */}
      <div className="bg-surface-container-low p-8 rounded-sm relative group">
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-6">Carga Actual</p>
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <span className="text-6xl font-headline font-bold mono-nums text-white">{loadpct.toFixed(1)}<span className="text-xl font-light text-slate-500 ml-2">%</span></span>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Estado</p>
              <p className={`text-xs font-bold ${loadpct < 80 ? 'text-primary' : 'text-error'}`}>
                {loadpct < 50 ? 'ÓPTIMO' : loadpct < 80 ? 'ADVERTENCIA' : 'CRÍTICO'}
              </p>
            </div>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ease-out ${loadpct < 80 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${loadpct}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="mt-8 h-16 w-full flex items-end gap-1 opacity-40">
           {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className={`${i === 5 ? 'bg-primary' : 'bg-primary/40'} w-full transition-all duration-500`} style={{ height: `${Math.random() * 20 + 5}%` }}></div>
           ))}
        </div>
      </div>

      {/* Input Voltage */}
      <div className="bg-surface-container-low p-8 rounded-sm border-l-4 border-primary/20 flex flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-8">Voltaje de Línea</p>
          
          <div className="flex items-center gap-6">
            <div className="flex-1">
               <span className="text-5xl font-headline font-bold mono-nums text-white leading-none">{linev.toFixed(1)}</span>
               <span className="text-xl font-light text-slate-500 ml-1">VAC</span>
            </div>
            <div className="w-16 h-16 rounded-sm bg-surface-container-highest flex items-center justify-center">
               <span className="material-symbols-outlined text-primary text-3xl" data-icon="electric_bolt">electric_bolt</span>
            </div>
          </div>
        </div>

        {/* Sense Section */}
        <div className="bg-surface-container p-6 flex flex-col justify-between border-t border-outline-variant/5 mt-8">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-tertiary/50" data-icon="settings_input_component">settings_input_component</span>
            <span className="text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-slate-400">SENSE</span>
          </div>
          <div className="mt-4">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sensibilidad</div>
            <div className="font-headline text-3xl tabular-nums truncate">{sense}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
