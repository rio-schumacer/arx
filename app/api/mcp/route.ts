import { NextRequest, NextResponse } from 'next/server';

const TOOLS = [
{
name: 'get_wallet_position',
description: 'Get real-time Aave V3 lending position for any wallet address on Mantle network. Returns health factor, collateral, debt, available borrows, and LTV.',
inputSchema: {
type: 'object',
properties: {
address: { type: 'string', description: 'Ethereum wallet address (0x...)' },
},
required: ['address'],
},
},
{
name: 'get_apy_rates',
description: 'Get live APY rates from Aave V3 and Lendle lending protocols on Mantle network.',
inputSchema: { type: 'object', properties: {} },
},
{
name: 'analyze_risk',
description: 'Analyze a lending position risk using Groq AI. Returns HOLD/REPAY/SUPPLY/REBALANCE decision with urgency level and reasoning.',
inputSchema: {
type: 'object',
properties: {
address: { type: 'string', description: 'Wallet address to analyze' },
},
required: ['address'],
},
},
{
name: 'get_gas_price',
description: 'Get current gas price on Mantle network vs Ethereum L1, with cost comparison in USD.',
inputSchema: { type: 'object', properties: {} },
},
{
name: 'get_whale_positions',
description: 'Get top active Aave V3 positions on Mantle — known whale wallets with collateral, debt, and health factor.',
inputSchema: { type: 'object', properties: {} },
},
];

const WHALES = [
'0x4f2b9eca5886867d2d00c494e39e0ea127566220',
'0x8e900d7cc784a47b2f5b4baf0871aadf792d0cc1',
'0xd5adc2b081551201a2d7baf6752a1b49bcd7aaee',
];

async function callTool(name: string, args: any, origin: string) {
switch (name) {
case 'get_wallet_position': {
const res = await fetch(`${origin}/api/watch-wallet?address=${args.address}`);
return await res.json();
}
case 'get_apy_rates': {
const res = await fetch(`${origin}/api/aave-rates`);
return await res.json();
}
case 'analyze_risk': {
const pos = await fetch(`${origin}/api/watch-wallet?address=${args.address}`).then(r => r.json());
const res = await fetch(`${origin}/api/agent`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ position: pos }),
});
return await res.json();
}
case 'get_gas_price': {
const res = await fetch(`${origin}/api/gas-compare`);
return await res.json();
}
case 'get_whale_positions': {
const results = await Promise.all(
WHALES.map(addr =>
fetch(`${origin}/api/watch-wallet?address=${addr}`)
.then(r => r.json())
.then(data => ({ address: addr, ...data }))
.catch(() => ({ address: addr, error: 'failed' }))
)
);
return results;
}
default:
throw new Error(`Unknown tool: ${name}`);
}
}

export async function GET() {
return NextResponse.json({
name: 'arx-mcp-server',
version: '1.0.0',
description: 'ARX — AI-native DeFi data layer for Mantle. Exposes real-time Aave V3 position data, APY rates, risk analysis, and gas comparison.',
tools: TOOLS,
endpoint: '/api/mcp',
docs: 'POST /api/mcp with { tool, args } to call a tool.',
});
}

export async function POST(req: NextRequest) {
try {
const { tool, args = {} } = await req.json();
const origin = req.nextUrl.origin;
const result = await callTool(tool, args, origin);
return NextResponse.json({ tool, result });
} catch (e: any) {
return NextResponse.json({ error: e.message }, { status: 400 });
}
}
