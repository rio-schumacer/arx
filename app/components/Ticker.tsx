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
// silent fail
}
}
fetchWhales();
const interval = setInterval(fetchWhales, 60_000);
return () => clearInterval(interval);
}, []);

if (positions.length === 0) return null;

const items = [...positions, ...positions]; // duplicate for seamless loop

return (
<div className="w-full overflow-hidden bg-gray-950 border-y border-gray-800 py-2">
<div className="flex animate-marquee whitespace-nowrap gap-12">
{items.map((pos, i) => (
<span key={i} className="text-xs font-mono text-gray-400 flex items-center gap-2">
<span className="text-gray-600">◆</span>
<span className="text-gray-300">{truncateAddress(pos.address)}</span>
<span>·</span>
<span className="text-white">${(pos.totalCollateralUsd / 1000).toFixed(1)}K supplied</span>
<span>·</span>
<span className="text-orange-400">${(pos.totalDebtUsd / 1000).toFixed(1)}K borrowed</span>
<span>·</span>
<span className={hfColor(pos.healthFactor)}>HF {pos.healthFactor.toFixed(2)}</span>
</span>
))}
</div>
</div>
);
}
