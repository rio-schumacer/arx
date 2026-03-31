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

return (
<div style={{ borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', backgroundColor: '#0a0a0f', padding: '14px 0' }}>
<div style={{ margin: '0 auto', maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
<span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>⛽ Gas Cost</span>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{ fontSize: '12px', color: '#4b5563' }}>Mantle:</span>
<span style={{ fontSize: '13px', color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>${data.mantle.costUsd === '0.000000' ? '<$0.000001' : data.mantle.costUsd}</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{ fontSize: '12px', color: '#4b5563' }}>Ethereum L1:</span>
<span style={{ fontSize: '13px', color: '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>${data.ethereum.costUsd}</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
<span style={{ fontSize: '12px', color: '#4b5563' }}>Savings:</span>
<span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 700, fontFamily: 'monospace' }}>{parseInt(data.savingsMultiple).toLocaleString()}x cheaper on Mantle</span>
</div>
<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6b7280', marginLeft: 'auto' }}>
<span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
Live · updates every 30s
</span>
</div>
</div>
);
}
