'use client';

import { useState, useEffect } from 'react';

type Reserve = {
name: string;
symbol: string;
supplyApy: number;
borrowApr: number;
};

type Protocol = {
protocol: string;
asset: string;
apy: number;
};

export function Simulate() {
const [amount, setAmount] = useState('');
const [selected, setSelected] = useState(0);
const [protocols, setProtocols] = useState<Protocol[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch('/api/aave-rates')
.then((r) => r.json())
.then((data: Reserve[]) => {
const list = data.map((r) => ({
protocol: 'Aave V3',
asset: r.symbol,
apy: parseFloat(r.supplyApy.toFixed(2)),
}));
setProtocols(list);
setLoading(false);
})
.catch(() => setLoading(false));
}, []);

const parsed = parseFloat(amount) || 0;
const current = protocols[selected];
const daily = current ? (parsed * current.apy) / 100 / 365 : 0;
const monthly = daily * 30;
const yearly = current ? (parsed * current.apy) / 100 : 0;

return (
<div className="px-6 py-8 space-y-6 max-w-lg">
<div className="flex items-center justify-between">
<h2 className="text-sm text-gray-400 font-medium">Simulate Yield</h2>
{!loading && (
<span className="text-xs text-green-400">● Live rates · Aave V3 Mantle</span>
)}
</div>

{/* Amount Input */}
<div className="space-y-2">
<label className="text-xs text-gray-500">Amount (USD)</label>
<input
type="number"
value={amount}
onChange={(e) => setAmount(e.target.value)}
placeholder="e.g. 1000"
className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
/>
</div>

{/* Protocol Selector */}
<div className="space-y-2">
<label className="text-xs text-gray-500">Asset</label>
{loading ? (
<p className="text-xs text-gray-600">Loading rates...</p>
) : (
<div className="space-y-2">
{protocols.map((p, i) => (
<button
key={i}
onClick={() => setSelected(i)}
className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
selected === i
? 'border-indigo-500 bg-indigo-950 text-white'
: 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600'
}`}
>
<span>{p.protocol} · {p.asset}</span>
<span className="text-green-400 font-mono">{p.apy}% APY</span>
</button>
))}
</div>
)}
</div>

{/* Result */}
{parsed > 0 && current && (
<div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
<p className="text-xs text-gray-500 font-medium">Estimated Earnings</p>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-400">Daily</span>
<span className="text-white font-mono">${daily.toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-gray-400">Monthly</span>
<span className="text-green-400 font-mono font-semibold">${monthly.toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-gray-400">Yearly</span>
<span className="text-white font-mono">${yearly.toFixed(2)}</span>
</div>
</div>
</div>
)}
</div>
);
}
