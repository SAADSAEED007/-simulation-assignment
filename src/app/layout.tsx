import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090b0f',
};

export const metadata: Metadata = {
  title: 'PSO Petrol Pump — Single-Server Queueing Analyzer',
  description:
    'Academic-grade interactive Simulation & Modeling queueing analyzer for M/M/1, M/G/1, and G/G/1 single-server petrol pump systems based on a 300-vehicle PSO dataset.',
  keywords: [
    'PSO Petrol Pump',
    'Single Server Queue',
    'M/M/1',
    'M/G/1',
    'G/G/1',
    'Pollaczek-Khinchine',
    'Kingman Approximation',
    'Operations Research',
    'Simulation and Modeling',
  ],
  authors: [{ name: 'Simulation & Modeling Research Project' }],
  openGraph: {
    title: 'PSO Petrol Pump — Single-Server Queueing Analyzer',
    description:
      'Rigorous academic queueing analysis comparing M/M/1, M/G/1, and G/G/1 queueing models with live parameter testing and stability diagnostics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#090b0f] text-[#f0f2f5] font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
