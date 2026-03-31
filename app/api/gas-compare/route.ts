import { NextResponse } from 'next/server';

async function getGasPrice(rpc: string): Promise<number> {
const res = await fetch(rpc, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 }),
});
const data = await res.json();
if (!data.result) throw new Error(`No result from ${rpc}: ${JSON.stringify(data)}`);
return Number(data.result);
}

export async function GET() {
try {
const [mantleGas, ethGas] = await Promise.all([
getGasPrice('https://rpc.mantle.xyz'),
getGasPrice('https://ethereum-rpc.publicnode.com'),
]);

// Estimate simple tx (21000 gas) cost in USD
// MNT price ~$0.80, ETH price ~$3000
const MNT_PRICE = 0.80;
const ETH_PRICE = 3000;
const GAS_LIMIT = 21000;

const mantleCostEth = (Number(mantleGas) * GAS_LIMIT) / 1e18;
const ethCostEth = (Number(ethGas) * GAS_LIMIT) / 1e18;

const mantleCostUsd = mantleCostEth * MNT_PRICE;
const ethCostUsd = ethCostEth * ETH_PRICE;

return NextResponse.json({
mantle: {
gasPrice: mantleGas.toString(),
costUsd: mantleCostUsd.toFixed(6),
costGwei: (Number(mantleGas) / 1e9).toFixed(4),
},
ethereum: {
gasPrice: ethGas.toString(),
costUsd: ethCostUsd.toFixed(4),
costGwei: (Number(ethGas) / 1e9).toFixed(2),
},
savingsMultiple: (ethCostUsd / mantleCostUsd).toFixed(0),
});
} catch (e: any) {
return NextResponse.json({ error: 'Failed to fetch gas prices', detail: e.message }, { status: 500 });
}
}
