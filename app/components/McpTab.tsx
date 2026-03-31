'use client';
import { useState } from 'react';

const TOOLS = [
{
name: 'get_wallet_position',
description: 'Get real-time Aave V3 lending position for any wallet on Mantle.',
params: 'address: string',
example: '{ "tool": "get_wallet_position", "args": { "address": "0x4f2b9eca5886867d2d00c494e39e0ea127566220" } }',
},
{
name: 'get_apy_rates',
description: 'Get live APY rates from Aave V3 and Lendle on Mantle.',
params: 'none',
example: '{ "tool": "get_apy_rates", "args": {} }',
},
{
name: 'analyze_risk',
description: 'AI-powered risk analysis — returns HOLD/REPAY/SUPPLY/REBALANCE with reasoning.',
params: 'address: string',
example: '{ "tool": "analyze_risk", "args": { "address": "0x4f2b9eca5886867d2d00c494e39e0ea127566220" } }',
},
{
name: 'get_gas_price',
description: 'Compare gas cost on Mantle vs Ethereum L1 in real-time.',
params: 'none',
example: '{ "tool": "get_gas_price", "args": {} }',
},
{
name: 'get_whale_positions',
description: 'Get top active Aave V3 whale positions on Mantle.',
params: 'none',
example: '{ "tool": "get_whale_positions", "args": {} }',
},
];

export default function McpTab() {
const [result, setResult] = useState<string>('');
const [loading, setLoading] = useState(false);
const [active, setActive] = useState('get_wallet_position');

const tool = TOOLS.find(t => t.name === active)!;

async function runTool() {
setLoading(true);
setResult('');
try {
const body = JSON.parse(tool.example);
const res = await fetch('/api/mcp', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body),
});
const data = await res.json();
setResult(JSON.stringify(data, null, 2));
} catch (e: any) {
setResult(`Error: ${e.message}`);
} finally {
setLoading(false);
}
}return (
<div style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
<div style={{ marginBottom: '32px' }}>
<h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>ARX MCP Server</h2>
<p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
ARX exposes an MCP-compatible API so any AI agent (Claude, Cursor, GPT) can access real-time Mantle DeFi data.
Call <code style={{ color: '#818cf8', backgroundColor: '#1e1b4b', padding: '2px 6px', borderRadius: '4px' }}>POST /api/mcp</code> with a tool name and args.
</p>
</div>

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
{TOOLS.map(t => (
<button
key={t.name}
onClick={() => { setActive(t.name); setResult(''); }}
style={{
padding: '6px 14px',
borderRadius: '8px',
fontSize: '12px',
fontWeight: 600,
fontFamily: 'monospace',
cursor: 'pointer',
border: active === t.name ? '1px solid #4f46e5' : '1px solid #374151',
backgroundColor: active === t.name ? '#1e1b4b' : 'transparent',
color: active === t.name ? '#818cf8' : '#6b7280',
}}
>
{t.name}
</button>
))}
</div>

<div style={{ backgroundColor: '#0d0d14', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
<p style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{tool.name}</p>
<p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>{tool.description}</p>
<p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>Params: <span style={{ color: '#6b7280' }}>{tool.params}</span></p>
<pre style={{ backgroundColor: '#111827', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#818cf8', overflowX: 'auto', marginTop: '12px' }}>
{tool.example}
</pre>
<button
onClick={runTool}
disabled={loading}
style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
>
{loading ? 'Running...' : '▶ Run Tool'}
</button>
</div>

{result && (
<pre style={{ backgroundColor: '#0a0a0f', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', fontSize: '12px', color: '#34d399', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
{result}
</pre>
)}
</div>
);
}
