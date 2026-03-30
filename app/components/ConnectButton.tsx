'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectButton() {
const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();
const { connect } = useConnect();
const [mounted, setMounted] = useState(false);

useEffect(() => { setMounted(true); }, []);

if (!mounted) {
return (
<button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
<span className="w-2 h-2 rounded-full bg-white/40"></span>
Connect Wallet
</button>
);
}

if (isConnected && address) {
return (
<button
onClick={() => disconnect()}
className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-mono px-4 py-2 rounded-lg border border-gray-700 transition-colors"
>
<span className="w-2 h-2 rounded-full bg-green-400"></span>
{address.slice(0, 6)}...{address.slice(-4)}
</button>
);
}

return (
<button
onClick={() => connect({ connector: injected() })}
className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
>
<span className="w-2 h-2 rounded-full bg-white/40"></span>
Connect Wallet
</button>
);
}