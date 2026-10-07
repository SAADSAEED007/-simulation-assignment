'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
          
          {/* Left Brand Identity: PSO Logo + Text */}
          <a href="#" className="flex items-center gap-2.5 group">
            {/* Official PSO Roundel Logo */}
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <Image
                src="/images/pso-logo.png"
                alt="PSO Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(53,230,167,0.35)]"
                priority
              />
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
