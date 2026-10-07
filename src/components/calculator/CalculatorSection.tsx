'use client';

import React, { useState } from 'react';
import { ModelType, CalculatorFormValues, CalculatedResults } from '@/types/queueing';
import {
  Car,
  Fuel,
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CalculatorSectionProps {
  model: ModelType;
  setModel: (m: ModelType) => void;
  formValues: CalculatorFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<CalculatorFormValues>>;
  results: CalculatedResults | null;
  errors: Record<string, string>;
  onCalculate: () => void;
  onClear: () => void;
  onLoadPSOExample: () => void;
  psoLoadedFeedback: string | null;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  model,
  setModel,
  formValues,
  setFormValues,
  results,
  errors,
  onCalculate,
  onClear,
  onLoadPSOExample,
  psoLoadedFeedback,
}) => {
  const [showFormulas, setShowFormulas] = useState(false);

  // Sync helpers
  const handleInterArrivalChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedRate = !isNaN(num) && num > 0 ? (60 / num).toFixed(2) : '';
      return {
        ...prev,
        interArrivalTime: val,
        arrivalRate: computedRate,
      };
    });
  };

  const handleArrivalRateChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedTime = !isNaN(num) && num > 0 ? (60 / num).toFixed(2) : '';
      return {
        ...prev,
        arrivalRate: val,
        interArrivalTime: computedTime,
      };
    });
  };

  const handleServiceTimeChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedRate = !isNaN(num) && num > 0 ? (60 / num).toFixed(2) : '';
      return {
        ...prev,
        serviceTime: val,
        serviceRate: computedRate,
      };
    });
  };

  const handleServiceRateChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedTime = !isNaN(num) && num > 0 ? (60 / num).toFixed(2) : '';
      return {
        ...prev,
        serviceRate: val,
        serviceTime: computedTime,
      };
    });
  };

  // Variance / StdDev sync for M/G/1
  const handleVarianceChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedStd = !isNaN(num) && num >= 0 ? Math.sqrt(num).toFixed(2) : '';
      return {
        ...prev,
        serviceVariance: val,
        serviceStdDev: computedStd,
      };
    });
  };

  const handleStdDevChange = (val: string) => {
    setFormValues((prev) => {
      const num = parseFloat(val);
      const computedVar = !isNaN(num) && num >= 0 ? (num * num).toFixed(2) : '';
      return {
        ...prev,
        serviceStdDev: val,
        serviceVariance: computedVar,
      };
    });
  };

  return (
    <section id="calculator" className="py-8 bg-[#090b0f] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* STEP 1: SELECT MODEL */}
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5 font-semibold">
            <span>STEP 1</span>
            <span className="text-zinc-600">•</span>
            <span>CHOOSE QUEUEING MODEL</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(['MM1', 'MG1', 'GG1'] as ModelType[]).map((m) => {
              const isSelected = model === m;
              const descriptions: Record<ModelType, string> = {
                MM1: 'Exponential Arrivals & Service',
                MG1: 'General Service Variance',
                GG1: 'General Arrivals & Service',
              };
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                      : 'border-zinc-800 bg-[#11141b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm sm:text-base text-white">
                      {m === 'MM1' ? 'M/M/1' : m === 'MG1' ? 'M/G/1' : 'G/G/1'}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 font-mono truncate">
                    {descriptions[m]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK BANNER (IF PSO EXAMPLE WAS LOADED) */}
        {psoLoadedFeedback && (
          <div className="mb-6 p-3 rounded-md bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{psoLoadedFeedback}</span>
            </div>
            <button
              onClick={onClear}
              className="text-[11px] underline text-amber-300 hover:text-white ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* STEP 2: INPUT CARD */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-[#11141b] shadow-xl mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                STEP 2
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono uppercase">
                Enter Petrol Pump Data
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLoadPSOExample}
                className="px-2.5 py-1 rounded border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                title="Fill calculator with observed PSO values as an example"
              >
                Load PSO Example
              </button>
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. ARRIVAL INPUTS */}
            <div className="space-y-4 p-4 rounded-lg border border-zinc-800/80 bg-[#0c0e14]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase border-b border-zinc-800 pb-2">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Vehicle Arrival Information</span>
              </div>

              {/* Inter-arrival time */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  Average Inter-Arrival Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 5.0"
                    value={formValues.interArrivalTime}
                    onChange={(e) => handleInterArrivalChange(e.target.value)}
                    className="w-full bg-[#11141b] border border-zinc-700 focus:border-emerald-500 rounded-md px-3 py-2 text-base font-mono text-white focus:outline-none placeholder:text-zinc-600"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                    minutes
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Average time elapsed between two vehicle arrivals.
                </p>
              </div>

              {/* Or Arrival Rate */}
              <div className="pt-2 border-t border-zinc-800/60">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <label className="text-zinc-400">
                    Or Arrival Rate (λ)
                  </label>
                  {formValues.arrivalRate && (
                    <span className="text-emerald-400 text-[11px]">
                      λ = {parseFloat(formValues.arrivalRate).toFixed(2)} veh/hr
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 12"
                    value={formValues.arrivalRate}
                    onChange={(e) => handleArrivalRateChange(e.target.value)}
                    className="w-full bg-[#11141b] border border-zinc-700 focus:border-emerald-500 rounded-md px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none placeholder:text-zinc-600"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                    veh/hr
                  </span>
                </div>
              </div>

              {/* G/G/1 Specific: Arrival Std Dev */}
              {model === 'GG1' && (
                <div className="pt-2 border-t border-zinc-800/60">
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    Arrival Standard Deviation (σA)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 2.5"
                      value={formValues.arrivalStdDev}
                      onChange={(e) =>
                        setFormValues((p) => ({ ...p, arrivalStdDev: e.target.value }))
                      }
                      className="w-full bg-[#11141b] border border-zinc-700 focus:border-emerald-500 rounded-md px-3 py-2 text-sm font-mono text-white focus:outline-none placeholder:text-zinc-600"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                      minutes
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    Measures variability in inter-arrival intervals.
                  </p>
                </div>
              )}

              {/* Arrival Error Message */}
              {(errors.arrival || errors.arrivalStdDev) && (
                <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                  {errors.arrival || errors.arrivalStdDev}
                </div>
              )}
            </div>

            {/* 2. SERVICE INPUTS */}
            <div className="space-y-4 p-4 rounded-lg border border-zinc-800/80 bg-[#0c0e14]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase border-b border-zinc-800 pb-2">
                <Fuel className="w-4 h-4 text-amber-400" />
                <span>Fuel Attendant Service Information</span>
              </div>

              {/* Service time */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  Average Service Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 4.0"
                    value={formValues.serviceTime}
                    onChange={(e) => handleServiceTimeChange(e.target.value)}
                    className="w-full bg-[#11141b] border border-zinc-700 focus:border-amber-500 rounded-md px-3 py-2 text-base font-mono text-white focus:outline-none placeholder:text-zinc-600"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                    minutes
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Average time required to fuel one vehicle.
                </p>
              </div>

              {/* Or Service Rate */}
              <div className="pt-2 border-t border-zinc-800/60">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <label className="text-zinc-400">
                    Or Service Rate (μ)
                  </label>
                  {formValues.serviceRate && (
                    <span className="text-amber-400 text-[11px]">
                      μ = {parseFloat(formValues.serviceRate).toFixed(2)} veh/hr
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 15"
                    value={formValues.serviceRate}
                    onChange={(e) => handleServiceRateChange(e.target.value)}
                    className="w-full bg-[#11141b] border border-zinc-700 focus:border-amber-500 rounded-md px-3 py-2 text-sm font-mono text-amber-400 focus:outline-none placeholder:text-zinc-600"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                    veh/hr
                  </span>
                </div>
              </div>

              {/* M/G/1 Specific: Variance or Std Dev */}
              {model === 'MG1' && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <label className="text-zinc-300">
                      Service-Time Dispersion
                    </label>
                    <div className="flex items-center rounded border border-zinc-800 bg-zinc-900 text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          setFormValues((p) => ({ ...p, serviceVarianceOption: 'variance' }))
                        }
                        className={`px-2 py-0.5 rounded-l ${
                          formValues.serviceVarianceOption === 'variance'
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Variance
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormValues((p) => ({ ...p, serviceVarianceOption: 'stdDev' }))
                        }
                        className={`px-2 py-0.5 rounded-r ${
                          formValues.serviceVarianceOption === 'stdDev'
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Std Dev
                      </button>
                    </div>
                  </div>

                  {formValues.serviceVarianceOption === 'variance' ? (
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          placeholder="e.g. 4.0"
                          value={formValues.serviceVariance}
                          onChange={(e) => handleVarianceChange(e.target.value)}
                          className="w-full bg-[#11141b] border border-zinc-700 focus:border-amber-500 rounded-md px-3 py-2 text-sm font-mono text-white focus:outline-none placeholder:text-zinc-600"
                        />
                        <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                          min²
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        Var(S) describes how individual fueling durations vary around the average.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          placeholder="e.g. 2.0"
                          value={formValues.serviceStdDev}
                          onChange={(e) => handleStdDevChange(e.target.value)}
                          className="w-full bg-[#11141b] border border-zinc-700 focus:border-amber-500 rounded-md px-3 py-2 text-sm font-mono text-white focus:outline-none placeholder:text-zinc-600"
                        />
                        <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                          minutes
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        Variance = (Standard Deviation)²
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* G/G/1 Specific: Service Std Dev */}
              {model === 'GG1' && (
                <div className="pt-2 border-t border-zinc-800/60">
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    Service Standard Deviation (σS)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 2.0"
                      value={formValues.serviceStdDev}
                      onChange={(e) =>
                        setFormValues((p) => ({ ...p, serviceStdDev: e.target.value }))
                      }
                      className="w-full bg-[#11141b] border border-zinc-700 focus:border-amber-500 rounded-md px-3 py-2 text-sm font-mono text-white focus:outline-none placeholder:text-zinc-600"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-zinc-500">
                      minutes
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    Standard deviation of vehicle service times.
                  </p>
                </div>
              )}

              {/* Service Error Message */}
              {(errors.service || errors.serviceVariance || errors.serviceStdDev) && (
                <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                  {errors.service || errors.serviceVariance || errors.serviceStdDev}
                </div>
              )}
            </div>

          </div>

          {/* STEP 3: ACTION BUTTON */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-white font-semibold">Active Model: </span>
              <span className="text-emerald-400 font-bold">
                {model === 'MM1' ? 'M/M/1' : model === 'MG1' ? 'M/G/1' : 'G/G/1'}
              </span>
            </div>

            <button
              type="button"
              onClick={onCalculate}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-mono font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Queue</span>
            </button>
          </div>

        </div>

        {/* STEP 4: RESULTS SECTION */}
        <div id="step-4" className="mb-12 scroll-mt-24">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2 font-semibold">
            STEP 4
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono uppercase">
              Queueing Results
            </h2>
            {results && (
              <a
                href="#system-schematic"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/35 text-[11px] font-mono text-emerald-300 hover:text-white transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-transitioning to System Schematic ↓</span>
              </a>
            )}
          </div>

          {!results ? (
            /* EMPTY INITIAL RESULTS STATE */
            <div className="p-10 rounded-xl border border-zinc-800/80 bg-[#11141b] text-center space-y-3 font-mono">
              <div className="w-12 h-12 rounded-full bg-zinc-800/60 border border-zinc-700 mx-auto flex items-center justify-center text-zinc-400">
                <Calculator className="w-6 h-6 text-emerald-400/80" />
              </div>
              <h3 className="text-base font-bold text-zinc-200 uppercase">
                Enter your data to calculate queue performance
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Fill in the arrival and service inputs above, then click <strong className="text-emerald-400">&quot;Calculate Queue&quot;</strong> to evaluate server utilization, queue length, and waiting times.
              </p>
            </div>
          ) : (
            /* POPULATED RESULTS */
            <div className="space-y-6">
              
              {/* STABILITY BANNER */}
              <div
                className={`p-4 rounded-lg border font-mono transition-all ${
                  results.isStable
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                    : 'border-rose-500/60 bg-rose-950/30 text-rose-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                    {results.isStable ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                    )}
                    <span>
                      {results.isStable
                        ? 'STABLE SYSTEM (ρ < 1.0)'
                        : results.status === 'CRITICAL'
                        ? 'CRITICAL SATURATION (ρ = 1.0)'
                        : 'UNSTABLE SINGLE-SERVER SYSTEM (ρ > 1.0)'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold">
                    Traffic Intensity: <span className="text-white">ρ = {results.rho.toFixed(3)}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {results.statusMessage}
                </p>
              </div>

              {/* 5 RESULT METRIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                
                {/* 1. Utilization */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                    UTILIZATION (ρ)
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {results.rho.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {(results.rho * 100).toFixed(1)}% server busy
                  </span>
                </div>

                {/* 2. Queue Length Lq */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                    AVG QUEUE LENGTH (Lq)
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {results.isStable && results.Lq !== null ? `${results.Lq.toFixed(2)}` : '∞'}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {results.isStable ? 'vehicles in line' : 'infinite queue'}
                  </span>
                </div>

                {/* 3. System Length L */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                    TOTAL IN SYSTEM (L)
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {results.isStable && results.L !== null ? `${results.L.toFixed(2)}` : '∞'}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {results.isStable ? 'queue + at pump' : 'diverges to ∞'}
                  </span>
                </div>

                {/* 4. Waiting Time Wq */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                    AVG WAIT IN QUEUE (Wq)
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {results.isStable && results.WqMin !== null ? `${results.WqMin.toFixed(1)}m` : '∞'}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {results.isStable ? 'delay before fueling' : 'unbounded wait'}
                  </span>
                </div>

                {/* 5. System Time W */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-400 uppercase block font-semibold">
                    TOTAL TIME ON SITE (W)
                  </span>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {results.isStable && results.WMin !== null ? `${results.WMin.toFixed(1)}m` : '∞'}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    {results.isStable ? 'wait + fueling time' : 'diverges to ∞'}
                  </span>
                </div>

              </div>

              {/* COLLAPSIBLE: SHOW CALCULATION */}
              <div className="p-4 rounded-lg border border-zinc-800 bg-[#11141b] font-mono">
                <button
                  type="button"
                  onClick={() => setShowFormulas(!showFormulas)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold uppercase text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>Show Step-by-Step Calculation</span>
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400 text-[11px]">
                    {showFormulas ? 'Hide Formulas' : 'View Formulas'}
                    {showFormulas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {showFormulas && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded border border-zinc-800 bg-[#0c0e14] space-y-1.5 text-xs"
                        >
                          <div className="text-zinc-300 font-bold text-[11px] border-b border-zinc-800 pb-1">
                            {step.title}
                          </div>
                          <div className="text-emerald-400 font-semibold">{step.formula}</div>
                          <div className="text-zinc-400 text-[11px]">{step.substitution}</div>
                          <div className="text-white font-bold text-xs pt-1 border-t border-zinc-800/80">
                            ➜ {step.result}
                          </div>
                          {step.explanation && (
                            <p className="text-[10px] text-zinc-500 leading-normal">
                              {step.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
