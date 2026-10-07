'use client';

import React, { useState } from 'react';
import { Menu, X, Sun } from 'lucide-react';

interface NavbarProps {
  onOpenCalculator: () => void;
  activeModel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCalculator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(100,150,160,0.14)] bg-[#061217]/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          
          {/* Left Brand Identity: Droplet Icon + PSO + Queueing Calculator */}
          <a href="#" className="flex items-center gap-2.5 group">
            {/* Organic Green Droplet Mark matching reference */}
            <div className="w-7 h-7 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(53,230,167,0.55)]">
                <path
                  d="M12 2.2C12 2.2 4.5 11 4.5 16.2C4.5 20.2 7.8 23.5 12 23.5C16.2 23.5 19.5 20.2 19.5 16.2C19.5 11 12 2.2 12 2.2Z"
                  fill="url(#dropletGradient)"
                />
                {/* Subtle inner gloss highlight */}
                <path
                  d="M10 6C9 9 7.5 13 7.5 16C7.5 17.5 8 19 9 20"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="dropletGradient" x1="12" y1="2.2" x2="12" y2="23.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#49E8B0" />
                    <stop offset="0.65" stopColor="#20C98E" />
                    <stop offset="1" stopColor="#063D31" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#F5F7F8]">
                PSO
              </span>
              <span className="text-[13px] font-normal text-[#AABBC4] tracking-normal hidden sm:inline ml-1">
                Queueing Calculator
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#"
              className="relative text-[#F5F7F8] py-1 transition-colors flex flex-col items-center"
            >
              <span>Home</span>
              <span className="absolute -bottom-1.5 w-7 h-[2.5px] rounded-full bg-[#35E6A7] shadow-[0_0_8px_#35E6A7]" />
            </a>
            <a
              href="#calculator"
              onClick={onOpenCalculator}
              className="text-[#AABBC4] hover:text-[#F5F7F8] py-1 transition-colors"
            >
              Calculator
            </a>
            <a
              href="#pso-study"
              className="text-[#AABBC4] hover:text-[#F5F7F8] py-1 transition-colors"
            >
              PSO Study
            </a>
            <a
              href="#models"
              className="text-[#AABBC4] hover:text-[#F5F7F8] py-1 transition-colors"
            >
              Model Guide
            </a>
          </nav>

          {/* Right Action: Theme Icon */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-1.5 rounded-full text-[#AABBC4] hover:text-[#F5F7F8] hover:bg-[#081A20] transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 stroke-[1.75]" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-[#AABBC4] hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(100,150,160,0.2)] bg-[#07151B] px-6 py-4 space-y-3 font-medium text-sm">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#35E6A7] py-1"
          >
            Home
          </a>
          <a
            href="#calculator"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculator();
            }}
            className="block text-[#AABBC4] hover:text-white py-1"
          >
            Calculator
          </a>
          <a
            href="#pso-study"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#AABBC4] hover:text-white py-1"
          >
            PSO Study
          </a>
          <a
            href="#models"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#AABBC4] hover:text-white py-1"
          >
            Model Guide
          </a>
        </div>
      )}
    </header>
  );
};
