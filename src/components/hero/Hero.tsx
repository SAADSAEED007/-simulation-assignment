'use client';

import React from 'react';
import Image from 'next/image';
import {
  Fuel,
  ArrowRight,
  FileText,
  Crosshair,
  Calculator,
  TrendingUp,
  Car,
  Users,
  LogOut,
  BarChart3,
  Layers,
  Network,
  ChevronDown,
} from 'lucide-react';
import { ModelType } from '@/types/queueing';

interface HeroProps {
  onSelectModel?: (m: ModelType) => void;
  onOpenCalculator?: () => void;
  onOpenPSOStudy?: () => void;
  onLoadPSOExample?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectModel,
  onOpenCalculator,
  onOpenPSOStudy,
  onLoadPSOExample,
}) => {
  const handleScrollToCalculator = () => {
    if (onOpenCalculator) onOpenCalculator();
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToPSOStudy = () => {
    if (onOpenPSOStudy) onOpenPSOStudy();
    const el = document.getElementById('pso-study');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModelClick = (model: ModelType) => {
    if (onSelectModel) onSelectModel(model);
    handleScrollToCalculator();
  };

  return (
    <section className="relative w-full bg-[#061217] text-[#F5F7F8] overflow-hidden select-none">
      
      {/* ======================================================== */}
      {/* 1. UPPER CINEMATIC HERO (Image + Copy + Floating Flow Card) */}
      {/* ======================================================== */}
      <div className="relative w-full min-h-[440px] lg:h-[465px] xl:h-[485px] flex items-center overflow-hidden">
        
        {/* Background Image Layer: EXACT asset /images/hero-background.png */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.png"
            alt="PSO Petrol Pump Station Night Lighting with Waiting Vehicles"
            fill
            priority
            className="object-cover object-[center_32%] lg:object-[82%_32%]"
            sizes="100vw"
          />

          {/* Left-to-Right Dark Gradient Overlay (Natural Dark Blend on Left, Clear Station on Right) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                90deg,
                #061217 0%,
                rgba(6, 18, 23, 0.98) 26%,
                rgba(6, 18, 23, 0.88) 40%,
                rgba(6, 18, 23, 0.52) 54%,
                rgba(6, 18, 23, 0.12) 72%,
                rgba(6, 18, 23, 0.03) 100%
              )`,
            }}
          />

          {/* Top subtle fade from navbar */}
          <div
            className="absolute inset-x-0 top-0 h-14 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, #061217 0%, transparent 100%)',
            }}
          />

          {/* Bottom gradient fade before the curve */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, #061217 0%, rgba(6,18,23,0.75) 40%, transparent 100%)',
            }}
          />
        </div>

        {/* Content Container (Matches Website Container) */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT COLUMN: Hero Copy & Feature Rows (~45% width) */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-3 max-w-2xl">
              
              {/* TOP BADGE: Outlined pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(53,230,167,0.45)] bg-[rgba(6,61,49,0.25)] shadow-[0_0_12px_rgba(53,230,167,0.16)]">
                <Fuel className="w-3.5 h-3.5 text-[#35E6A7]" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#35E6A7]">
                  PSO PETROL PUMP
                </span>
              </div>

              {/* MAIN HERO HEADING: 2 Lines exactly matching the reference */}
              <div className="space-y-0 pt-0.5">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-black tracking-[-0.03em] leading-[1.02] text-[#F5F7F8]">
                  Queueing Theory
                </h1>
                <div className="text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-black tracking-[-0.03em] leading-[1.02] text-[#35E6A7] drop-shadow-[0_0_20px_rgba(53,230,167,0.22)]">
                  Calculator
                </div>
              </div>

              {/* DESCRIPTION: Exactly matches reference text */}
              <p className="text-sm sm:text-[15px] text-[#AABBC4] leading-relaxed max-w-[490px] font-normal pt-0.5">
                Analyze vehicle arrivals and fueling service using M/M/1, M/G/1 and G/G/1 queueing models.
              </p>

              {/* ACCENT LINE: Short horizontal mint green bar */}
              <div className="w-12 h-[3px] bg-[#35E6A7] rounded-full my-3 shadow-[0_0_8px_#35E6A7]" />

              {/* FEATURE ROW: 3 compact features with circular outlined icons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-5 sm:gap-7 pt-0.5 pb-0.5">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[rgba(53,230,167,0.42)] bg-[rgba(6,61,49,0.3)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_10px_rgba(53,230,167,0.18)] shrink-0">
                    <Crosshair className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#F5F7F8] leading-tight">
                      Real-World Scenario
                    </div>
                    <div className="text-[11px] text-[#AABBC4] mt-0.5">
                      PSO Petrol Pump
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[rgba(53,230,167,0.42)] bg-[rgba(6,61,49,0.3)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_10px_rgba(53,230,167,0.18)] shrink-0">
                    <Calculator className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#F5F7F8] leading-tight">
                      3 Queueing Models
                    </div>
                    <div className="text-[11px] text-[#AABBC4] mt-0.5">
                      M/M/1 · M/G/1 · G/G/1
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[rgba(53,230,167,0.42)] bg-[rgba(6,61,49,0.3)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_10px_rgba(53,230,167,0.18)] shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#F5F7F8] leading-tight">
                      Easy to Use
                    </div>
                    <div className="text-[11px] text-[#AABBC4] mt-0.5">
                      Simple inputs, clear results
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleScrollToCalculator}
                  className="h-10 sm:h-11 px-6 rounded-full bg-[#35E6A7] hover:bg-[#49E8B0] active:scale-[0.98] text-[#061217] font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(53,230,167,0.32)]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <a
                  href="/zPSBnw.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 sm:h-11 px-5 rounded-full border border-[rgba(100,150,160,0.3)] hover:border-[#35E6A7]/50 bg-[#061217]/50 hover:bg-[#07151B] text-[#F5F7F8] font-medium text-sm flex items-center gap-2 transition-all backdrop-blur-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#AABBC4]" />
                  <span>View PSO Study</span>
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: Station View + Floating Queue Flow Card */}
            <div className="lg:col-span-5 xl:col-span-6 relative min-h-[140px] lg:h-full flex items-end justify-end">
              
              {/* QUEUE FLOW / INFO CARD in the lower-right area */}
              <div
                className="w-full sm:w-[390px] px-3.5 py-2.5 rounded-[20px] border border-[rgba(53,230,167,0.35)] shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative z-20"
                style={{
                  background: 'rgba(5, 20, 25, 0.72)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-center justify-between text-center">
                  
                  {/* Stage 1: Arrivals */}
                  <div className="flex flex-col items-center flex-1">
                    <Car className="w-4 h-4 text-[#35E6A7] mb-1 stroke-[2]" />
                    <span className="text-[10px] text-[#AABBC4] font-medium tracking-wide">
                      Arrivals
                    </span>
                  </div>

                  {/* Arrow 1 */}
                  <div className="text-[#35E6A7]/75 text-xs font-bold px-0.5">→</div>

                  {/* Stage 2: Queue */}
                  <div className="flex flex-col items-center flex-1">
                    <Users className="w-4 h-4 text-[#35E6A7] mb-1 stroke-[2]" />
                    <span className="text-[10px] text-[#AABBC4] font-medium tracking-wide">
                      Queue
                    </span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="text-[#35E6A7]/75 text-xs font-bold px-0.5">→</div>

                  {/* Stage 3: Fueling Server */}
                  <div className="flex flex-col items-center flex-1">
                    <Fuel className="w-4 h-4 text-[#35E6A7] mb-1 stroke-[2]" />
                    <span className="text-[10px] text-[#AABBC4] font-medium tracking-wide">
                      Fueling Server
                    </span>
                  </div>

                  {/* Arrow 3 */}
                  <div className="text-[#35E6A7]/75 text-xs font-bold px-0.5">→</div>

                  {/* Stage 4: Exit */}
                  <div className="flex flex-col items-center flex-1">
                    <LogOut className="w-4 h-4 text-[#35E6A7] mb-1 stroke-[2]" />
                    <span className="text-[10px] text-[#AABBC4] font-medium tracking-wide">
                      Exit
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. LOWER HERO TRANSITION: SUBTLE CURVED GLOWING GREEN LINE */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mt-5 sm:-mt-7 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-7 sm:h-10 text-[#35E6A7] block"
        >
          {/* Faint Glow layer following reference curve */}
          <path
            d="M 0,38 C 240,10 520,38 820,46 C 1100,52 1300,40 1440,34"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeOpacity="0.14"
          />
          {/* Crisp Primary Line */}
          <path
            d="M 0,38 C 240,10 520,38 820,46 C 1100,52 1300,40 1440,34"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 3. THREE MODEL SUMMARIES IMMEDIATELY BELOW HERO */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-0 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          
          {/* Model 1: M/M/1 */}
          <div
            onClick={() => handleModelClick('MM1')}
            className="group flex items-center gap-3.5 py-1.5 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-full border border-[rgba(53,230,167,0.45)] bg-[rgba(6,61,49,0.25)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_12px_rgba(53,230,167,0.18)] shrink-0 group-hover:border-[#35E6A7] transition-colors">
              <BarChart3 className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-[#F5F7F8] tracking-tight group-hover:text-[#35E6A7] transition-colors">
                M/M/1
              </h3>
              <p className="text-[11px] sm:text-xs text-[#AABBC4] leading-relaxed">
                Markovian arrivals + Markovian service
                <br />
                <span className="text-[#AABBC4]/80">+ one server</span>
              </p>
            </div>
          </div>

          {/* Model 2: M/G/1 (With subtle vertical left border on md+) */}
          <div
            onClick={() => handleModelClick('MG1')}
            className="group flex items-center gap-3.5 py-1.5 md:pl-8 md:border-l md:border-[rgba(100,150,160,0.16)] cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-full border border-[rgba(53,230,167,0.45)] bg-[rgba(6,61,49,0.25)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_12px_rgba(53,230,167,0.18)] shrink-0 group-hover:border-[#35E6A7] transition-colors">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-[#F5F7F8] tracking-tight group-hover:text-[#35E6A7] transition-colors">
                M/G/1
              </h3>
              <p className="text-[11px] sm:text-xs text-[#AABBC4] leading-relaxed">
                Markovian arrivals + General service
                <br />
                <span className="text-[#AABBC4]/80">+ one server</span>
              </p>
            </div>
          </div>

          {/* Model 3: G/G/1 (With subtle vertical left border on md+) */}
          <div
            onClick={() => handleModelClick('GG1')}
            className="group flex items-center gap-3.5 py-1.5 md:pl-8 md:border-l md:border-[rgba(100,150,160,0.16)] cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-full border border-[rgba(53,230,167,0.45)] bg-[rgba(6,61,49,0.25)] flex items-center justify-center text-[#35E6A7] shadow-[0_0_12px_rgba(53,230,167,0.18)] shrink-0 group-hover:border-[#35E6A7] transition-colors">
              <Network className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-[#F5F7F8] tracking-tight group-hover:text-[#35E6A7] transition-colors">
                G/G/1
              </h3>
              <p className="text-[11px] sm:text-xs text-[#AABBC4] leading-relaxed">
                General arrivals + General service
                <br />
                <span className="text-[#AABBC4]/80">+ one server</span>
              </p>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. SCROLL INDICATOR: Mouse outline + Scroll Down text */}
        {/* ======================================================== */}
        <div className="pt-2 pb-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleScrollToCalculator}
            className="group flex flex-col items-center gap-1 text-xs text-[#AABBC4] hover:text-[#35E6A7] transition-colors"
          >
            {/* Mouse outline icon with moving dot */}
            <div className="w-3.5 h-6 rounded-full border border-[rgba(100,150,160,0.45)] group-hover:border-[#35E6A7] flex items-start justify-center p-0.5 transition-colors">
              <div className="w-1 h-1.5 rounded-full bg-[#35E6A7] animate-bounce" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium tracking-wide">
              <span>Scroll Down</span>
              <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </div>

    </section>
  );
};
