"use client";

import { useEffect, useState } from "react";

type Position = {
address: string;
totalCollateralUsd: number;
totalDebtUsd: number;
healthFactor: number;
};

function truncateAddress(addr: string) {
return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function hfColor(hf: number) {
if (hf > 2) return "text-green-400";
if (hf > 1.5) return "text-yellow-400";
return "text-red-400";
}

export function Ticker() {
const [positions, setPositions] = useState<Position[]>([]);

useEffect(() => {
async function fetchWhales() {
try {
const res = await fetch("/api/watch-wallet", { method: "POST" });
const data = await res.json();
setPositions(data);
} catch {
// silent
}
}
fetchWhales();
const interval = setInterval(fetchWhales, 60_000);
return () => clearInterval(interval);
}, []);

if (positions.length === 0) return null;

const items = [...positions, ...positions];

return (
<div className="overflow-hidden py-1.5 bg-gray-950/80">
<div className="flex animate-marquee whitespace-nowrap gap-8">
{items.map((pos, i) => (
<span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500">
<span className="text-indigo-700">◆</span>
<span className="text-gray-400">{truncateAddress(pos.address)}</span>
<span className="text-gray-700">·</span>
<span className="text-gray-300">${(pos.totalCollateralUsd / 1000).toFixed(1)}K</span>
<span className="text-gray-700">/</span>
<span className="text-orange-400/80">${(pos.totalDebtUsd / 1000).toFixed(1)}K debt</span>
<span className="text-gray-700">·</span>
<span className={hfColor(pos.healthFactor)}>HF {pos.healthFactor.toFixed(2)}</span>
</span>
))}
</div>
</div>
);
}
