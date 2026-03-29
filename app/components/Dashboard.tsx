'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

const mockPositions = [
{
protocol: 'Aave V3',
supplied: { amount: '500', asset: 'USDC', apy: 8.2 },
borrowed: { amount: '0.1', asset: 'ETH', apr: 4.5 },
healthFactor: 2.4,
},
{
protocol: 'Lendle',
supplied: { amount: '200', asset: 'USDT', apy: 6.8 },
borrowed: null,
healthFactor: null,
},
];

type AgentResult = {
action: string;
urgency: string;
reason: string;
suggestion: string;
};

function HealthBadge({ value }: { value: number | null }) {
if (!value) return null;
const color = value > 2 ? 'text-green-400' : value > 1.5 ? 'text-yellow-400' : 'text-red-400';
return <span className={`text-xs font-mono ${color}`}>HF {value.toFixed(1)} ✓</span>;
}

function urgencyColor(urgency: string) {
if (urgency === 'high') return 'text-red-400';
if (urgency === 'medium') return 'text-yellow-400';
return 'text-green-400';
}

export function Dashboard() {
const { isConnected } = useAccount();
const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
const [loading, setLoading] = useState(false);
const [agentActive, setAgentActive] = useState(false);

if (!isConnected) {
return (
<div className="px-6 py-12 text-center">
<p className="text-gray-500 text-sm">Connect your wallet to view lending positions.</p>
</div>
);
}

const totalEarning = 58.2;
const netApy = 7.4;

async function activateAgent() {
setLoading(true);
setAgentActive(true);
try {
const res = await fetch('/api/agent', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
healthFactor: 2.4,
supplyApy: 8.2,
borrowApy: 4.5,
totalSupply: 700,
totalDebt: 180,
}),
});
const data = await res.json();
setAgentResult(data);
} catch {
setAgentResult({
action: 'HOLD',
urgency: 'low',
reason: 'Unable to fetch analysis',
suggestion: 'Try again later',
});
} finally {
setLoading(false);
}
}

return (
<div className="px-6 py-8 space-y-6">
{/* Summary */}
<div className="grid grid-cols-2 gap-4">
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-xs text-gray-500 mb-1">Total Earning</p>
<p className="text-2xl font-bold text-white">${totalEarning.toFixed(2)}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
</div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
<p className="text-xs text-gray-500 mb-1">Net APY</p>
<p className="text-2xl font-bold text-indigo-400">{netApy}%</p>
</div>
</div>

{/* Positions */}
<div className="space-y-4">
<h2 className="text-sm text-gray-400 font-medium">Your Positions · Mantle</h2>
{mockPositions.map((pos) => (
<div key={pos.protocol} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
<div className="flex items-center justify-between">
<span className="text-sm font-semibold text-white">{pos.protocol}</span>
<HealthBadge value={pos.healthFactor} />
</div>
<div className="space-y-1">
<p className="text-xs text-gray-400">
Supplied: <span className="text-white">{pos.supplied.amount} {pos.supplied.asset}</span>
<span className="text-green-400 ml-2">@ {pos.supplied.apy}% APY</span>
</p>
{pos.borrowed ? (
<p className="text-xs text-gray-400">
Borrowed: <span className="text-white">{pos.borrowed.amount} {pos.borrowed.asset}</span>
<span className="text-orange-400 ml-2">@ {pos.borrowed.apr}% APR</span>
</p>
) : (
<p className="text-xs text-gray-600">Borrowed: —</p>
)}
</div>
</div>
))}
</div>

{/* Activate Agent */}
{!agentActive ? (
<button
onClick={activateAgent}
className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
>
⚡ Activate AI Agent
</button>
) : loading ? (
<div className="bg-gray-900 border border-indigo-800 rounded-xl p-5 text-center">
<p className="text-indigo-400 text-sm animate-pulse">🤖 Agent analyzing your positions...</p>
</div>
) : agentResult ? (
<div className="bg-indigo-950 border border-indigo-800 rounded-xl p-5 space-y-3">
<div className="flex items-center justify-between">
<p className="text-xs text-indigo-400 font-medium">⚡ AI Agent Decision</p>
<span className={`text-xs font-mono font-bold ${urgencyColor(agentResult.urgency || 'low')}`}>
{agentResult.action} · {(agentResult.urgency || 'low').toUpperCase()}
</span>
</div>
<p className="text-sm text-gray-300">{agentResult.reason}</p>
<div className="bg-gray-900 rounded-lg p-3">
<p className="text-xs text-gray-400 mb-1">Suggested Action</p>
<p className="text-sm text-white">{agentResult.suggestion}</p>
</div>
<p className="text-xs text-gray-600">Session key active · Agent monitoring 24/7 via AA</p>
</div>
) : null}
</div>
);
}
