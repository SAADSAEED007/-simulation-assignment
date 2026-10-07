'use client';

import React from 'react';
import { PSO_DATASET_INFO } from '@/data/psoDataset';
import { Database, Clock, Car, Fuel, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';

interface PSOStudySectionProps {
  onLoadPSOExample: () => void;
}

export const PSOStudySection: React.FC<PSOStudySectionProps> = ({ onLoadPSOExample }) => {
  const { totalVehicles, totalSessions, sessions, timings, financials } = PSO_DATASET_INFO;

  return (
    <section id="pso-study" className="py-12 bg-[#090b0f] border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1">
              OBSERVATION DATASET — REFERENCE ONLY
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono uppercase">
              About Our PSO Petrol Pump Study
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 font-mono">
              The software was designed around an empirical observation project at a Pakistan State Oil (PSO) petrol station. This dataset serves as reference documentation.
            </p>
          </div>

          <button
            type="button"
            onClick={onLoadPSOExample}
            className="self-start sm:self-auto px-4 py-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-500 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
          >
            <span>Load PSO Example Data</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#11141b]">
            <span className="text-zinc-500 text-[10px] block">TOTAL SAMPLE</span>
            <div className="text-xl font-bold text-white mt-1">{totalVehicles} Vehicles</div>
            <span className="text-zinc-400 text-[10px]">4 sessions (75 ea)</span>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#11141b]">
            <span className="text-zinc-500 text-[10px] block">INTER-ARRIVAL AVG</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{timings.interArrivalTimeMin.toFixed(2)} min</div>
            <span className="text-zinc-400 text-[10px]">λ ≈ {timings.arrivalRatePerHour.toFixed(1)} veh/hr</span>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#11141b]">
            <span className="text-zinc-500 text-[10px] block">FUELING TIME AVG</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{timings.fuelingDurationMin.toFixed(2)} min</div>
            <span className="text-zinc-400 text-[10px]">μ ≈ {timings.serviceRatePerHour.toFixed(1)} veh/hr</span>
          </div>

          <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#11141b]">
            <span className="text-zinc-500 text-[10px] block">OBSERVED WAIT AVG</span>
            <div className="text-xl font-bold text-cyan-400 mt-1">{timings.waitingTimeMin.toFixed(2)} min</div>
            <span className="text-zinc-400 text-[10px]">Total on site: {timings.totalTimeOnSiteMin.toFixed(1)}m</span>
          </div>
        </div>

        {/* Important Academic Distinction Box */}
        <div className="p-4 rounded-lg border border-amber-500/40 bg-amber-950/20 text-xs font-mono text-zinc-300 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Important Academic Distinction</span>
          </div>
          <p className="leading-relaxed text-zinc-300">
            &ldquo;The real petrol pump may have multiple fueling points in parallel. This project models the scenario as a single-server system because the course assignment specifically focuses on single-server queueing models (M/M/1, M/G/1, G/G/1).&rdquo;
          </p>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            When the raw PSO observation values (1.60m arrival interval, 4.52m fueling time) are entered into a single-server model, the utilization reaches ρ ≈ 2.82 &gt; 1, indicating that a single server would be unstable. The real station maintains a modest 4.42-minute wait because multiple pumps operate in parallel.
          </p>
        </div>

        {/* Observation Sessions Table */}
        <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-white uppercase text-xs">
              Observation Sessions Record (August 2026)
            </span>
            <span className="text-[10px] text-zinc-500">Field Logs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sessions.map((s) => (
              <div
                key={s.sessionNumber}
                className="p-2.5 rounded border border-zinc-800 bg-[#0c0e14] flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-semibold">
                    Session {s.sessionNumber}: {s.day}, {s.date}
                  </div>
                  <div className="text-zinc-400 text-[11px]">{s.timeWindow}</div>
                </div>
                <div className="text-emerald-400 font-bold">{s.vehicleCount} veh</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-zinc-400 text-[11px]">
            <span>
              Recorded Revenue: <strong className="text-white">PKR {financials.totalRevenuePKR.toLocaleString()}</strong>
            </span>
            <span>
              Average Transaction: <strong className="text-amber-400">PKR {financials.averageTransactionPKR.toLocaleString()}</strong>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
