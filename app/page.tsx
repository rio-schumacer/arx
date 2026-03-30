'use client';

import { ConnectButton } from './components/ConnectButton';
import { Dashboard } from './components/Dashboard';
import { Simulate } from './components/Simulate';
import { Ticker } from './components/Ticker';

export default function Home() {
return (
<main className="min-h-screen bg-[#0a0a0f] text-white">
{/* Header */}
<div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
<div>
<h1 className="text-xl font-bold tracking-widest text-white">ARX</h1>
<p className="text-xs text-gray-500">Lending Command Center · Mantle</p>
</div>
<ConnectButton />
</div>

{/* Hero */}
<div className="px-6 py-10 text-center border-b border-gray-800">
<h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
Your Autonomous<br />
<span className="text-indigo-400">Lending Agent</span>
</h2>
<p className="text-sm text-gray-500 max-w-md mx-auto">
AI-powered position manager for Aave V3 on Mantle. Monitor any wallet, analyze health factor, and execute via Account Abstraction.
</p>
</div>

{/* Ticker */}
<Ticker />

{/* Body — 2 columns on desktop, stacked on mobile */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-800 min-h-[600px]">
<div className="overflow-y-auto">
<Dashboard />
</div>
<div className="overflow-y-auto">
<Simulate />
</div>
</div>
</main>
);
}
