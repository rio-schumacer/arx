export type AaveReserve = {
name: string;
symbol: string;
supplyApy: number;
borrowApr: number;
};

// Fallback rates — update manually or replace with live fetch
const FALLBACK_RATES: AaveReserve[] = [
{ name: 'USD Coin', symbol: 'USDC', supplyApy: 8.2, borrowApr: 10.1 },
{ name: 'Tether USD', symbol: 'USDT', supplyApy: 7.9, borrowApr: 9.8 },
{ name: 'Wrapped Ether', symbol: 'WETH', supplyApy: 2.1, borrowApr: 3.4 },
{ name: 'Mantle', symbol: 'MNT', supplyApy: 4.5, borrowApr: 6.2 },
];

export async function fetchAaveRates(): Promise<AaveReserve[]> {
try {
const res = await fetch(
'https://api.goldsky.com/api/public/project_clk74pd7lueg738tw9bfo4agx/subgraphs/aave-v3-mantle/1.0.0/gn',
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
query: `{
reserves(first: 10, where: { isActive: true }) {
name
symbol
liquidityRate
variableBorrowRate
isActive
}
}`,
}),
next: { revalidate: 60 },
}
);

const json = await res.json();
const reserves = json?.data?.reserves ?? [];

if (reserves.length === 0) return FALLBACK_RATES;

return reserves.map((r: any) => ({
name: r.name,
symbol: r.symbol,
supplyApy: (parseFloat(r.liquidityRate) / 1e27) * 100,
borrowApr: (parseFloat(r.variableBorrowRate) / 1e27) * 100,
}));
} catch {
return FALLBACK_RATES;
}
}
const AAVE_V3_POOL = "0x458F293454fE0d67EC0655f3672301301DD51422";
const MANTLE_RPC = "https://rpc.mantle.xyz";

export type AavePosition = {
address: string;
totalCollateralUsd: number;
totalDebtUsd: number;
availableBorrowsUsd: number;
healthFactor: number;
ltv: number;
};

export async function getUserAccountData(address: string): Promise<AavePosition | null> {
try {
const padded = address.toLowerCase().replace("0x", "").padStart(64, "0");
const res = await fetch(MANTLE_RPC, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
jsonrpc: "2.0",
method: "eth_call",
params: [
{
to: AAVE_V3_POOL,
data: "0xbf92857c" + padded,
},
"latest",
],
id: 1,
}),
});

const json = await res.json();
const raw: string = json?.result ?? "0x";
if (!raw || raw === "0x") return null;

const slots = [];
for (let i = 2; i < raw.length; i += 64) {
slots.push(raw.slice(i, i + 64));
}

if (slots.length < 6) return null;

const totalCollateralUsd = parseInt(slots[0], 16) / 1e8;
const totalDebtUsd = parseInt(slots[1], 16) / 1e8;
const availableBorrowsUsd = parseInt(slots[2], 16) / 1e8;
const ltv = parseInt(slots[4], 16) / 100;
const hfRaw = parseInt(slots[5], 16);
const healthFactor = hfRaw > 1e30 ? 999 : hfRaw / 1e18;

if (totalCollateralUsd === 0) return null;

return {
address,
totalCollateralUsd,
totalDebtUsd,
availableBorrowsUsd,
healthFactor,
ltv,
};
} catch {
return null;
}
}

export const WHALE_ADDRESSES = [
"0x4f2b9eca5886867d2d00c494e39e0ea127566220",
"0x8e900d7cc784a47b2f5b4baf0871aadf792d0cc1",
"0xd5adc2b081551201a2d7baf6752a1b49bcd7aaee",
];
