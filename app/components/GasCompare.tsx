'use client';
import { useEffect, useState } from 'react';

interface GasData {
mantle: { costUsd: string; costGwei: string };
ethereum: { costUsd: string; costGwei: string };
savingsMultiple: string;
}

export default function GasCompare() {
const [data, setData] = useState<GasData | null>(null);

useEffect(() => {
const fetch_ = () =>
fetch('/api/gas-compare')
.then(r => r.json())
.then(setData)
.catch(() => {});
fetch_();
const t = setInterval(fetch_, 30000);
return () => clearInterval(t);
}, []);

if (!data) return null;

const mantleCost = data.mantle.costUsd === '0.000000' ? '<$0.000001' : `$${data.mantle.costUsd}`;

return (
<div style={{ borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', backgroundColor: '#0a0a0f', padding: '10px 0' }}>
<div style={{ margin: '0 auto', maxWidth: '1280px', paddingLeft: '16px', paddingRight: '16px' }}>
{/* Row 1: label + live */}
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
<span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>⛽ Gas Cost</span>
<span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6b7280' }}>
<span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
Live on-chain · refreshes every 30s
</span>
</div>
{/* Row 2: data */}
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', rowGap: '4px' }}>
<span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
Mantle: <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>{mantleCost}</span>
</span>
<span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
ETH L1: <span style={{ color: '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>${data.ethereum.costUsd}</span>
</span>
<span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
Save: <span style={{ color: '#818cf8', fontWeight: 700, fontFamily: 'monospace' }}>{parseInt(data.savingsMultiple).toLocaleString()}x on Mantle</span>
</span>
</div>
</div>
</div>
);
}
