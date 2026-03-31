'use client';

import { useState } from 'react';
import { ConnectButton } from './components/ConnectButton';
import { Dashboard } from './components/Dashboard';
import { Simulate } from './components/Simulate';
import { Ticker } from './components/Ticker';
import GasCompare from './components/GasCompare';
import McpTab from './components/McpTab';

const container = { margin: '0 auto', maxWidth: '1280px', width: '100%' };

export default function Home() {
const [activeTab, setActiveTab] = useState<'home' | 'mcp'>('home');
return (
<main className="min-h-screen bg-[#0a0a0f] text-white w-full">

{/* Navbar */}
<header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-[#0a0a0f]/80 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.4)]">
<div style={container} className="px-6 py-5 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
<span className="text-white text-sm font-black">A</span>
</div>
<h1 className="text-xl font-black tracking-widest text-white">ARX</h1>
<div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
<button
onClick={() => setActiveTab('home')}
style={{ padding: '4px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: activeTab === 'home' ? '1px solid #4f46e5' : '1px solid transparent', backgroundColor: activeTab === 'home' ? '#1e1b4b' : 'transparent', color: activeTab === 'home' ? '#818cf8' : '#6b7280' }}
>
Dashboard
</button>
<button
onClick={() => setActiveTab('mcp')}
style={{ padding: '4px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: activeTab === 'mcp' ? '1px solid #4f46e5' : '1px solid transparent', backgroundColor: activeTab === 'mcp' ? '#1e1b4b' : 'transparent', color: activeTab === 'mcp' ? '#818cf8' : '#6b7280' }}
>
MCP
</button>
</div>
</div>
<ConnectButton />
</div>
</header>

{/* Hero */}
<div className="border-b border-gray-800">
<div style={{...container, paddingTop: '30px', paddingBottom: '30px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
<div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 rounded-full px-4 py-1.5 mb-8">
<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
<span className="text-sm text-indigo-300">Live on Mantle · Aave V3 + Lendle</span>
</div>
<h1 className="text-8xl md:text-9xl font-black text-white mb-6 tracking-tight">ARX</h1>
<h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6 tracking-tight">
Your Autonomous Lending Agent
</h2>
<p className="text-base text-gray-500 max-w-lg text-center leading-relaxed">
Monitor any wallet, get AI-powered risk analysis, and protect your position with Account Abstraction.
</p>
</div>
</div>

{/* Features */}
<div className="border-b border-gray-800">
<div style={{...container, paddingTop: '20px', paddingBottom: '20px', paddingLeft: '24px', paddingRight: '24px'}}>
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
<div className="flex flex-col items-center text-center space-y-4">
<div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-2xl">⚡</div>
<h3 className="text-lg font-bold text-white">Watch Any Wallet</h3>
<p className="text-sm text-gray-500 leading-relaxed">Track real-time Aave V3 positions on Mantle. Health factor, collateral, debt — all live from chain.</p>
</div>
<div className="flex flex-col items-center text-center space-y-4">
<div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-2xl">🤖</div>
<h3 className="text-lg font-bold text-white">AI Risk Analysis</h3>
<p className="text-sm text-gray-500 leading-relaxed">AI-powered agent analyzes your position and returns HOLD / REPAY / SUPPLY decisions with clear reasoning.</p>
</div>
<div className="flex flex-col items-center text-center space-y-4">
<div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-2xl">🔐</div>
<h3 className="text-lg font-bold text-white">Account Abstraction</h3>
<p className="text-sm text-gray-500 leading-relaxed">Approve once via ZeroDev session keys. Agent executes within defined limits — no repeated signatures.</p>
</div>
</div>
</div>
</div>

{/* Ticker */}
<div className="border-b border-gray-800">
<div style={container} className="px-6 py-3 overflow-hidden">
<Ticker />
</div>
</div>
<GasCompare />

{activeTab === 'home' ? (
<div style={{ margin: '0 auto', maxWidth: '1280px', width: '100%', paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px', paddingBottom: '40px' }}>
<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
<div style={{ paddingRight: '0', paddingTop: '16px', paddingBottom: '16px' }} className="lg:border-r lg:border-gray-800 lg:pr-12">
<Dashboard />
</div>
<div style={{ paddingTop: '16px', paddingBottom: '16px' }} className="lg:pl-12 border-t border-gray-800 lg:border-t-0">
<Simulate />
</div>
</div>
</div>
) : (
<McpTab />
)}

{/* Footer */}
<div style={{ borderTop: '1px solid #1f2937', marginTop: '16px' }}>
<div style={{ ...container, paddingTop: '28px', paddingBottom: '28px', paddingLeft: '32px', paddingRight: '32px' }} className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<span style={{ color: 'white', fontSize: '11px', fontWeight: 900 }}>A</span>
</div>
<span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>ARX</span>
</div>
<p style={{ fontSize: '13px', color: '#4b5563' }}>Built on Mantle · Powered by Aave V3, Groq AI & ZeroDev AA</p>
<p style={{ fontSize: '13px', color: '#4b5563' }}>© 2026 ARX</p>
</div>
</div>

</main>
);
}
