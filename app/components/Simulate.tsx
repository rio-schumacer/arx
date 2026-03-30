'use client';

import { useState, useEffect } from 'react';

type Protocol = {
protocol: string;
asset: string;
supplyApy: number;
borrowApr: number;
};

const LTV_BY_ASSET: Record<string, number> = {
USDC: 75, USDT: 75, WETH: 80, WMNT: 65, MNT: 65,
WBTC: 70, USDe: 72,
};

type SimMode = 'supply' | 'borrow';

export function Simulate() {
const [mode, setMode] = useState<SimMode>('supply');
const [amount, setAmount] = useState('');
const [selected, setSelected] = useState(0);
const [protocols, setProtocols] = useState<Protocol[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch('/api/aave-rates')
.then((r) => r.json())
.then((data: Protocol[]) => { setProtocols(data); setLoading(false); })
.catch(() => setLoading(false));
}, []);

const parsed = parseFloat(amount) || 0;
const current = protocols[selected];
const ltv = current ? (LTV_BY_ASSET[current.asset] ?? 70) : 70;

// Supply calcs
const daily = current ? (parsed * current.supplyApy) / 100 / 365 : 0;
const monthly = daily * 30;
const yearly = current ? (parsed * current.supplyApy) / 100 : 0;

// Borrow calcs
const maxBorrow = parsed * (ltv / 100);
const borrowCostMonthly = current ? (maxBorrow * current.borrowApr) / 100 / 12 : 0;
const netMonthly = monthly - borrowCostMonthly;
const healthFactor = maxBorrow > 0 ? (parsed * (ltv / 100)) / (maxBorrow * 0.9) : 0;
return (
<div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '24px' }} className="space-y-5">

{/* Header */}
<div className="flex items-center justify-between">
<div className="flex gap-1 bg-gray-900 rounded-lg p-1">
<button
onClick={() => setMode('supply')}
className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'supply' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
>
Supply
</button>
<button
onClick={() => setMode('borrow')}
className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'borrow' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
>
Borrow
</button>
</div>
{!loading && <span className="text-xs text-green-400">● Live rates · Mantle</span>}
</div>

{/* Amount */}
<div className="space-y-1.5">
<label className="text-sm text-gray-500">{mode === 'supply' ? 'Supply Amount (USD)' : 'Collateral Amount (USD)'}</label>
<input
type="number"
value={amount}
onChange={(e) => setAmount(e.target.value)}
placeholder="e.g. 1000"
className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
/>
</div>

{/* Asset selector */}
<div className="space-y-1.5">
<label className="text-sm text-gray-500">Protocol · Asset</label>
{loading ? (
<p className="text-sm text-gray-600 animate-pulse">Loading live rates...</p>
) : (
<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
{protocols.map((p, i) => (
<button
key={i}
onClick={() => setSelected(i)}
className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
selected === i ? 'border-indigo-500 bg-indigo-950 text-white' : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600'
}`}
>
<div className="text-left">
<span className="text-white">{p.asset}</span>
<span className="text-gray-600 ml-2 text-xs">{p.protocol}</span>
</div>
<div className="text-right">
{mode === 'supply' ? (
<><span className="text-green-400 font-mono">{p.supplyApy.toFixed(2)}%</span><span className="text-gray-600 text-xs ml-1">APY</span></>
) : (
<><span className="text-orange-400 font-mono">{p.borrowApr.toFixed(2)}%</span><span className="text-gray-600 text-xs ml-1">APR</span></>
)}
</div>
</button>
))}
</div>
)}
</div>

{/* Results */}
{parsed > 0 && current && (
<div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
{mode === 'supply' ? (
<>
<div className="flex items-center justify-between">
<p className="text-sm text-gray-500 font-medium">Estimated Earnings</p>
<span className="text-xs text-gray-600">{current.supplyApy.toFixed(2)}% APY</span>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm"><span className="text-gray-400">Daily</span><span className="text-white font-mono">${daily.toFixed(2)}</span></div>
<div className="flex justify-between text-sm"><span className="text-gray-400">Monthly</span><span className="text-green-400 font-mono font-bold">${monthly.toFixed(2)}</span></div>
<div className="flex justify-between text-sm"><span className="text-gray-400">Yearly</span><span className="text-white font-mono">${yearly.toFixed(2)}</span></div>
</div>
{current.borrowApr > 0 && (
<div className="border-t border-gray-800 pt-3 flex justify-between text-xs">
<span className="text-gray-500">Borrow APR</span>
<span className="text-orange-400 font-mono">{current.borrowApr.toFixed(2)}%</span>
</div>
)}
</>
) : (
<>
<div className="flex items-center justify-between">
<p className="text-sm text-gray-500 font-medium">Borrow Simulation</p>
<span className="text-xs text-gray-600">LTV {ltv}% · {current.asset}</span>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm"><span className="text-gray-400">Collateral</span><span className="text-white font-mono">${parsed.toLocaleString()}</span></div>
<div className="flex justify-between text-sm"><span className="text-gray-400">Max Borrow</span><span className="text-green-400 font-mono font-bold">${maxBorrow.toFixed(2)}</span></div>
<div className="flex justify-between text-sm"><span className="text-gray-400">Borrow Cost/mo</span><span className="text-orange-400 font-mono">${borrowCostMonthly.toFixed(2)}</span></div>
<div className="flex justify-between text-sm"><span className="text-gray-400">Supply Earn/mo</span><span className="text-green-400 font-mono">${monthly.toFixed(2)}</span></div>
</div>
<div className="border-t border-gray-800 pt-3 space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-400">Net Monthly</span>
<span className={`font-mono font-bold ${netMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netMonthly.toFixed(2)}</span>
</div>
<div className="flex justify-between text-xs">
<span className="text-gray-500">Est. Health Factor</span>
<span className={`font-mono ${healthFactor > 2 ? 'text-green-400' : healthFactor > 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>{healthFactor.toFixed(2)}</span>
</div>
</div>
</>
)}
</div>
)}
</div>
);
}
