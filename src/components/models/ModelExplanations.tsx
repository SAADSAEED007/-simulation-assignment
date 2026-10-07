'use client';

import React from 'react';
import { ModelType } from '@/types/queueing';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface ModelExplanationsProps {
  onSelectModel: (m: ModelType) => void;
  activeModel: ModelType;
}

export const ModelExplanations: React.FC<ModelExplanationsProps> = ({
  onSelectModel,
  activeModel,
}) => {
  const models = [
    {
      id: 'MM1' as ModelType,
      name: 'M/M/1 Model',
      tagline: 'Markovian arrivals + Markovian service + 1 server',
      description:
        'Best for situations where vehicle inter-arrival times and fuel attendant service durations approximately follow memoryless exponential distributions. Solved using classic birth-death Markov processes.',
      formulaSummary: 'Lq = ρ² / (1 - ρ),  Wq = Lq / λ',
    },
    {
      id: 'MG1' as ModelType,
      name: 'M/G/1 Model',
      tagline: 'Markovian arrivals + General service + 1 server',
      description:
        'Useful when vehicle arrivals remain Poisson/exponential, but service times exhibit arbitrary variance Var(S) (e.g. varying vehicle tank sizes or payment methods). Solved via the Pollaczek–Khinchine relationship.',
      formulaSummary: 'Wq = λ·E[S²] / [2(1 - ρ)]',
    },
    {
      id: 'GG1' as ModelType,
      name: 'G/G/1 Model',
      tagline: 'General arrivals + General service + 1 server',
      description:
        'Accounts for stochastic variability in both arrivals (Ca) and service times (Cs). Estimated using Kingman’s Heavy-Traffic Approximation. Ideal for realistic non-exponential queues.',
      formulaSummary: 'Wq ≈ [ρ / (1 - ρ)] × [(Ca² + Cs²) / 2] × E[S]',
    },
  ];

  return (
    <section id="models" className="py-10 bg-[#090b0f] border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1">
            QUEUEING THEORY REFERENCE
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono uppercase">
            Model Explanations &amp; Assumptions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Overview of the three single-server queueing models analyzed in this software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((m) => {
            const isActive = activeModel === m.id;
            return (
              <div
                key={m.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-md ring-1 ring-emerald-500'
                    : 'border-zinc-800 bg-[#11141b] text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-white">
                      {m.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-emerald-400/90 font-mono">
                    {m.tagline}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                  <div className="text-[11px] font-mono text-zinc-500">
                    Key Formula: <span className="text-zinc-300 font-semibold">{m.formulaSummary}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id);
                      const el = document.getElementById('calculator');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 rounded border border-zinc-700 hover:border-emerald-500 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
                  >
                    Use in Calculator
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
