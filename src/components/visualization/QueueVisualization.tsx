'use client';

import React from 'react';
import { CalculatedResults } from '@/types/queueing';
import { Car, Fuel, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

interface QueueVisualizationProps {
  results: CalculatedResults | null;
}

export const QueueVisualization: React.FC<QueueVisualizationProps> = ({ results }) => {
  if (!results) {
    return null; // Only shows after calculation
  }

  const { rho, isStable, Lq, WqMin } = results;

  // Number of cars to visually illustrate in the waiting queue (max 5 for clean layout)
  const carsToDisplay = !isStable ? 6 : Math.min(5, Math.max(0, Math.round(Lq ?? 0)));

  return (
    <section id="system-schematic" className="py-10 bg-[#090b0f] border-t border-zinc-800/80 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Schematic Container with Cool Glowing Edge & Top Gradient */}
        <div className="relative p-6 sm:p-7 rounded-2xl border border-emerald-500/35 bg-[#0e121a] shadow-[0_0_35px_rgba(16,185,129,0.15)] space-y-6 overflow-hidden">
          
          {/* Top subtle animated neon accent beam */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4 font-mono">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                  SYSTEM SCHEMATIC
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] tracking-wider uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span>Active Flow</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Petrol Pump Queue Flow & State Transition
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {isStable ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.18)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Steady State: Attendant clears queue (ρ = {rho.toFixed(2)})</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-bounce" />
                  <span>Unstable Queue: Inflow exceeds service rate (ρ = {rho.toFixed(2)})</span>
                </span>
              )}
            </div>
          </div>

          {/* Interactive Visual Flow Pipeline */}
          <div className="py-2 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 font-mono text-xs">
            
            {/* 1. ARRIVING VEHICLES */}
            <div className="flex-1 w-full p-4 rounded-xl border border-zinc-800/90 bg-[#121622] hover:border-emerald-500/40 transition-colors text-center space-y-2 relative group">
              <span className="text-zinc-400 text-[11px] uppercase block font-semibold">
                VEHICLE ARRIVALS (λ = {results.lambda.toFixed(1)}/hr)
              </span>
              <div className="flex items-center justify-center gap-2 py-2">
                <Car className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
                <ArrowRight className="w-3 h-3 text-emerald-500/60 animate-pulse" />
                <Car className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
                <ArrowRight className="w-3 h-3 text-emerald-500/60 animate-pulse" />
                <Car className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Avg Inter-Arrival: <strong className="text-white">{results.meanInterArrivalMin.toFixed(2)} min</strong>
              </span>
            </div>

            {/* Pulsing Arrow 1 */}
            <div className="hidden md:flex flex-col items-center justify-center text-emerald-400/80 shrink-0 px-1">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowDown className="block md:hidden w-5 h-5 text-emerald-400/80 shrink-0" />

            {/* 2. WAITING QUEUE */}
            <div
              className={`flex-1 w-full p-4 rounded-xl border text-center space-y-2 transition-all relative ${
                isStable
                  ? 'border-zinc-800/90 bg-[#121622] hover:border-amber-500/40'
                  : 'border-rose-500/60 bg-rose-950/25 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] uppercase px-1">
                <span className="text-amber-400 font-bold">WAITING QUEUE (Lq)</span>
                <span className={isStable ? 'text-white font-bold' : 'text-rose-400 font-bold'}>
                  {isStable && Lq !== null ? `${Lq.toFixed(2)} veh` : 'Lq → ∞'}
                </span>
              </div>

              <div className="min-h-[38px] flex items-center justify-center gap-1.5 py-1 flex-wrap">
                {carsToDisplay === 0 ? (
                  <span className="text-[11px] text-zinc-500 italic">Immediate service (Empty queue)</span>
                ) : (
                  Array.from({ length: carsToDisplay }).map((_, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded-md border flex items-center gap-1 text-[10px] font-mono shadow-sm transition-transform hover:-translate-y-0.5 ${
                        !isStable
                          ? 'border-rose-700 bg-rose-900/60 text-rose-200'
                          : 'border-zinc-700 bg-zinc-800/90 text-amber-300'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>#{i + 1}</span>
                    </div>
                  ))
                )}
                {!isStable && (
                  <span className="text-[9px] text-rose-300 font-bold px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 animate-pulse">
                    + Overflow
                  </span>
                )}
              </div>

              <span className="text-[10px] text-zinc-400 block">
                Avg Waiting Time: <strong className="text-amber-300">{isStable && WqMin !== null ? `${WqMin.toFixed(1)} min` : '∞'}</strong>
              </span>
            </div>

            {/* Pulsing Arrow 2 */}
            <div className="hidden md:flex flex-col items-center justify-center text-emerald-400/80 shrink-0 px-1">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowDown className="block md:hidden w-5 h-5 text-emerald-400/80 shrink-0" />

            {/* 3. FUELING SERVER */}
            <div className="flex-1 w-full p-4 rounded-xl border border-emerald-500/40 bg-[#121622] hover:border-emerald-400 transition-colors text-center space-y-2 relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between text-[11px] uppercase">
                <span className="text-emerald-400 font-bold">1 FUEL ATTENDANT</span>
                <span className="text-[10px] text-zinc-400">μ = {results.mu.toFixed(1)}/hr</span>
              </div>
              
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <Fuel className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left font-mono">
                  <div className="text-white text-xs font-bold flex items-center gap-1.5">
                    <span>Pump Dispenser</span>
                    <Zap className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-zinc-400">{results.meanServiceMin.toFixed(2)} min service</div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 block">
                Server Utilization: <strong className="text-emerald-400">{(rho * 100).toFixed(1)}%</strong>
              </span>
            </div>

            {/* Pulsing Arrow 3 */}
            <div className="hidden md:flex flex-col items-center justify-center text-emerald-400/80 shrink-0 px-1">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowDown className="block md:hidden w-5 h-5 text-emerald-400/80 shrink-0" />

            {/* 4. EXIT / DEPARTURE */}
            <div className="flex-1 w-full p-4 rounded-xl border border-zinc-800/90 bg-[#121622] hover:border-cyan-500/40 transition-colors text-center space-y-2">
              <span className="text-zinc-400 text-[11px] uppercase block font-semibold">
                EXIT / DEPARTURE
              </span>
              <div className="flex items-center justify-center py-2">
                <Car className="w-5 h-5 text-cyan-400" />
                <ArrowRight className="w-3.5 h-3.5 text-cyan-500/60 ml-1.5 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Total System Time: <strong className="text-cyan-300">{isStable && results.WMin !== null ? `${results.WMin.toFixed(1)} min` : '∞'}</strong>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
