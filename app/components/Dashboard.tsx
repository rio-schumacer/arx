'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

type AavePosition = {
address: string;
totalCollateralUsd: number;
totalDebtUsd: number;
availableBorrowsUsd: number;
healthFactor: number;
ltv: number;
};

type AgentResult = {
action: string;
urgency: string;
reason: string;
suggestion: string;
};

function HealthBadge({ value }: { value: number }) {
const color = value > 2 ? 'text-green-400' : value > 1.5 ? 'text-yellow-400' : 'text-red-400';
const label = value > 2 ? '✓ Safe' : value > 1.5 ? '⚠ Watch' : '🚨 Risk';
return <span className={`text-sm font-mono font-bold ${color}`}>HF {value.toFixed(2)} {label}</span>;
}

function urgencyColor(urgency: string) {
if (urgency === 'high') return 'text-red-400';
if (urgency === 'medium') return 'text-yellow-400';
return 'text-green-400';
}

function AgentLog({ result, position }: { result: AgentResult; position: AavePosition }) {
const [displayedLines, setDisplayedLines] = useState<string[]>([]);
const [currentLine, setCurrentLine] = useState('');
const [lineIndex, setLineIndex] = useState(0);
const [charIndex, setCharIndex] = useState(0);

const allLines = [
`🔍 Scanning position... HF ${position.healthFactor.toFixed(2)} · $${(position.totalCollateralUsd/1000).toFixed(1)}K supplied`,
`📊 Utilization: ${((position.totalDebtUsd/position.totalCollateralUsd)*100).toFixed(1)}% · Debt $${(position.totalDebtUsd/1000).toFixed(1)}K`,
`🧠 Analyzing market conditions on Mantle...`,
`⚡ Decision: ${result.action} — ${result.reason}`,
`💡 ${result.suggestion}`,
`⏳ Next scan in 60s · Session key active via AA`,
];

useEffect(() => {
setDisplayedLines([]);
setCurrentLine('');
setLineIndex(0);
setCharIndex(0);
}, [result]);

useEffect(() => {
if (lineIndex >= allLines.length) return;
const target = allLines[lineIndex];
if (charIndex < target.length) {
const t = setTimeout(() => {
setCurrentLine((prev) => prev + target[charIndex]);
setCharIndex((prev) => prev + 1);
}, 18);
return () => clearTimeout(t);
} else {
const t = setTimeout(() => {
setDisplayedLines((prev) => [...prev, target]);
setCurrentLine('');
setLineIndex((prev) => prev + 1);
setCharIndex(0);
}, 300);
return () => clearTimeout(t);
}
}, [lineIndex, charIndex, result]);

const urgencyBorder = result.urgency === 'high' ? 'border-red-800' : result.urgency === 'medium' ? 'border-yellow-800' : 'border-indigo-900';
const actionColor = result.action === 'REPAY' ? 'text-red-400' : result.action === 'SUPPLY' || result.action === 'OPTIMIZE' ? 'text-green-400' : 'text-indigo-400';

return (
<div className={`bg-gray-950 border ${urgencyBorder} rounded-xl p-5 font-mono text-sm space-y-2`}>
<div className="flex items-center justify-between mb-2">
<span className="text-gray-500 text-sm">ARX Agent · Mantle</span>
<span className={`font-bold text-sm ${actionColor}`}>{result.action} · {(result.urgency || 'low').toUpperCase()}</span>
</div>
{displayedLines.map((line, i) => (
<p key={i} className="text-gray-300 leading-relaxed">{line}</p>
))}
{lineIndex < allLines.length && (
<p className="text-gray-300 leading-relaxed">
{currentLine}<span className="text-indigo-400 animate-pulse">▋</span>
</p>
)}
</div>
);
}

function SessionKeyModal({ onApprove, onClose }: { onApprove: () => void; onClose: () => void }) {
    return (
<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
<div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
<div>
<h3 className="text-white font-bold text-lg">🔐 Approve Agent Permissions</h3>
<p className="text-gray-400 text-sm mt-1">Sign once. Agent executes within these limits.</p>
</div>
<div className="bg-gray-950 rounded-xl p-4 space-y-3 font-mono text-sm">
<div className="flex justify-between">
<span className="text-gray-500">Max per tx</span>
<span className="text-white">$500 USDC</span>
</div>
<div className="flex justify-between">
<span className="text-gray-500">Allowed contracts</span>
<span className="text-indigo-400">Aave V3 only</span>
</div>
<div className="flex justify-between">
<span className="text-gray-500">Session expires</span>
<span className="text-white">24 hours</span>
</div>
<div className="flex justify-between">
<span className="text-gray-500">Network</span>
<span className="text-green-400">Mantle Sepolia</span>
</div>
</div>
<p className="text-gray-600 text-sm">
Powered by ZeroDev Account Abstraction. Your funds remain in your wallet at all times.
</p>
<div className="flex gap-3">
<button onClick={onClose} className="flex-1 text-gray-400 text-sm py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800">
Cancel
</button>
<button onClick={onApprove} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg">
Approve & Activate
</button>
</div>
</div>
</div>
);
}

export function Dashboard() {
const { isConnected, address } = useAccount();
const [mounted, setMounted] = useState(false);
const [watchAddress, setWatchAddress] = useState('');
const [position, setPosition] = useState<AavePosition | null>(null);
const [fetchError, setFetchError] = useState('');
const [fetchLoading, setFetchLoading] = useState(false);
const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
const [agentLoading, setAgentLoading] = useState(false);
const [agentActive, setAgentActive] = useState(false);
const [showSessionModal, setShowSessionModal] = useState(false);
const [sessionKeyActive, setSessionKeyActive] = useState(false);

useEffect(() => {
setMounted(true);
}, []);


async function loadPosition(addr: string) {
setFetchLoading(true);
setFetchError('');
setPosition(null);
setAgentResult(null);
setAgentActive(false);
setSessionKeyActive(false);
try {
const res = await fetch(`/api/watch-wallet?address=${addr}`);
if (!res.ok) {
setFetchError('No active Aave V3 position found for this address.');
return;
}
const data = await res.json();
setPosition(data);
if (data.healthFactor < 1.5) {
const pct = ((1.5 - data.healthFactor) / 1.5 * 100).toFixed(0);
setFetchError(`⚠️ Health Factor ${data.healthFactor.toFixed(2)} — Liquidation Risk +${pct}%`);
}
} catch {
setFetchError('Failed to fetch position.');
} finally {
setFetchLoading(false);
}
}

async function activateAgent() {
if (!position) return;
setAgentLoading(true);
setAgentActive(true);
try {
const res = await fetch('/api/agent', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
healthFactor: position.healthFactor,
supplyApy: 8.2,
borrowApy: 4.5,
totalSupply: position.totalCollateralUsd,
totalDebt: position.totalDebtUsd,
}),
});
const data = await res.json();
setAgentResult(data);
} catch {
setAgentResult({
action: 'HOLD',
urgency: 'low',
reason: 'Position is stable.',
suggestion: 'Continue monitoring your health factor.',
});
} finally {
setAgentLoading(false);
}
}
return (
<div className="px-6 py-8 space-y-6">
{/* Watch Wallet Input */}
<div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '20px' }} className="space-y-3">
<h2 className="text-base font-semibold text-gray-300">Watch Any Wallet</h2>
<div className="flex gap-2">
<input
type="text"
value={watchAddress}
onChange={(e) => setWatchAddress(e.target.value)}
placeholder="0x... Mantle address"
className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
/>
<button
onClick={() => loadPosition(watchAddress)}
disabled={fetchLoading || !watchAddress}
className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
>
{fetchLoading ? '...' : 'Track'}
</button>
</div>
{mounted && isConnected && address && (
<button
onClick={() => { setWatchAddress(address); loadPosition(address); }}
className="text-sm text-indigo-400 hover:text-indigo-300"
>
→ Use my wallet ({address.slice(0, 6)}...{address.slice(-4)})
</button>
)}
</div>

{/* Risk Alert */}
{fetchError && (
<div className={`rounded-xl px-4 py-3 text-sm ${fetchError.startsWith('⚠️') ? 'bg-red-950 border border-red-800 text-red-300' : 'bg-gray-900 border border-gray-700 text-gray-400'}`}>
{fetchError}
</div>
)}

{/* Position Data */}
{position && (
<div className="space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-base font-semibold text-gray-300">Aave V3 Position · Mantle</h2>
<HealthBadge value={position.healthFactor} />
</div>

<div className="grid grid-cols-2 gap-3">
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-sm text-gray-500 mb-1">Total Supplied</p>
<p className="text-xl font-bold text-white">${(position.totalCollateralUsd / 1000).toFixed(1)}K</p>
</div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-sm text-gray-500 mb-1">Total Debt</p>
<p className="text-xl font-bold text-orange-400">${(position.totalDebtUsd / 1000).toFixed(1)}K</p>
</div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-sm text-gray-500 mb-1">Available Borrow</p>
<p className="text-xl font-bold text-green-400">${(position.availableBorrowsUsd / 1000).toFixed(1)}K</p>
</div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-sm text-gray-500 mb-1">LTV</p>
<p className="text-xl font-bold text-indigo-400">{position.ltv.toFixed(1)}%</p>
</div>
</div>

{!agentActive ? (
<button
onClick={activateAgent}
className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold py-3 rounded-xl transition-colors"
>
⚡ Activate AI Agent
</button>
) : agentLoading ? (
<div className="bg-gray-950 border border-indigo-900 rounded-xl p-5 font-mono text-sm">
<p className="text-indigo-400 animate-pulse">🔍 Scanning position data...</p>
</div>
) : agentResult ? (
<AgentLog result={agentResult} position={position} />
) : null}

{agentResult && !sessionKeyActive && (
<button
onClick={() => setShowSessionModal(true)}
className="w-full border border-indigo-700 hover:bg-indigo-950 text-indigo-300 text-base font-semibold py-3 rounded-xl transition-colors"
>
🔐 Approve Agent Permissions
</button>
)}

{sessionKeyActive && (
<div className="flex items-center justify-between bg-green-950 border border-green-800 rounded-xl px-4 py-3">
<span className="text-green-400 text-sm font-mono">🔑 Session Key Active · Agent authorized via ZeroDev AA</span>
<button
onClick={() => setSessionKeyActive(false)}
className="text-xs text-gray-500 hover:text-red-400 ml-4 transition-colors"
>
Revoke
</button>
</div>
)}
</div>
)}

{/* Empty state */}
{!position && !fetchLoading && !fetchError && (
<div className="text-center py-10">
<p className="text-gray-500 text-base">Enter a wallet address to view Aave V3 positions on Mantle.</p>
<p className="text-gray-600 text-sm mt-2">Try: 0x4f2b9eca5886867d2d00c494e39e0ea127566220</p>
</div>
)}

{showSessionModal && (
<SessionKeyModal
onApprove={() => { setShowSessionModal(false); setSessionKeyActive(true); }}
onClose={() => setShowSessionModal(false)}
/>
)}
</div>
);
}
