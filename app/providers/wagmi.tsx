"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

const mantleSepolia = defineChain({
id: 5003,
name: "Mantle Sepolia",
nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
rpcUrls: {
default: { http: ["https://rpc.sepolia.mantle.xyz"] },
},
blockExplorers: {
default: { name: "Explorer", url: "https://explorer.sepolia.mantle.xyz" },
},
testnet: true,
});

const config = createConfig({
chains: [mantleSepolia],
transports: {
[mantleSepolia.id]: http(),
},
connectors: [injected()],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
return (
<WagmiProvider config={config}>
<QueryClientProvider client={queryClient}>
{children}
</QueryClientProvider>
</WagmiProvider>
);
}
