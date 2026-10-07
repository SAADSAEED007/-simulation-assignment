'use client';

import React from 'react';
import { Fuel, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="about" className="border-t border-zinc-800 bg-[#07090c] py-10 text-zinc-400 font-mono text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm uppercase">
              <Fuel className="w-4 h-4 text-emerald-400" />
              <span>PSO PETROL PUMP</span>
            </div>
            <div className="text-zinc-300 font-semibold text-xs">
              Single-Server Queueing Calculator
            </div>
            <p className="text-zinc-500 text-[11px]">
              Simulation &amp; Modeling Course Project • M/M/1 • M/G/1 • G/G/1
            </p>
          </div>

          <div className="text-[11px] text-zinc-500 md:text-right space-y-1">
            <div>Based on a 300-vehicle observation dataset for academic study</div>
            <div className="text-zinc-600">Built with Next.js + TypeScript</div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Academic simulation project for university coursework. Not an official Pakistan State Oil (PSO) product.
          </span>
          <span>
            Single-Server Operations Research Lab
          </span>
        </div>

      </div>
    </footer>
  );
};
