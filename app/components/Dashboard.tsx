'use client';

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

function HealthBadge({ value }: { value: number | null }) {
if (!value) return null;
const color = value > 2 ? 'text-green-400' : value > 1.5 ? 'text-yellow-400' : 'text-red-400';
return <span className={`text-xs font-mono ${color}`}>HF {value.toFixed(1)} ✓</span>;
}

export function Dashboard() {
const { isConnected } = useAccount();

if (!isConnected) {
return (
<div className="px-6 py-12 text-center">
<p className="text-gray-500 text-sm">Connect your wallet to view lending positions.</p>
</div>
);
}

const totalEarning = 58.2;
const netApy = 7.4;

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

{/* AI Suggestion */}
<div className="bg-indigo-950 border border-indigo-800 rounded-xl p-5">
<p className="text-xs text-indigo-400 font-medium mb-1">⚡ AI Suggestion</p>
<p className="text-sm text-gray-300">Move 200 USDT from Lendle to Aave V3 — earn <span className="text-green-400 font-semibold">+$12/month</span> extra at current rates.</p>
</div>
</div>
);
}
