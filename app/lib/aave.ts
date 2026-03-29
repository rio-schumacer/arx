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
