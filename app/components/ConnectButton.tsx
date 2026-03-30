'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectButton() {
const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();
const { connect } = useConnect();
const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
}, []);

if (!mounted) {
return (
<button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg">
Connect Wallet
</button>
);
}

if (isConnected && address) {
return (
<button
onClick={() => disconnect()}
className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg border border-gray-700"
>
{address.slice(0, 6)}...{address.slice(-4)}
</button>
);
}

return (
<button
onClick={() => connect({ connector: injected() })}
className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg"
>
Connect Wallet
</button>
);
}
