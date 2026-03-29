'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

const mantle = {
id: 5000,
name: 'Mantle',
nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
rpcUrls: {
default: { http: ['https://rpc.mantle.xyz'] },
},
blockExplorers: {
default: { name: 'Mantlescan', url: 'https://mantlescan.xyz' },
},
} as const;

const config = createConfig({
chains: [mantle],
connectors: [injected()],
transports: {
[mantle.id]: http(),
},
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
