'use client';

import { useState } from 'react';
import { ConnectButton } from './components/ConnectButton';
import { Dashboard } from './components/Dashboard';
import { Simulate } from './components/Simulate';

export default function Home() {
const [activeTab, setActiveTab] = useState('dashboard');

return (
<main className="min-h-screen bg-[#0a0a0f] text-white">
{/* Header */}
<div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
<div>
<h1 className="text-xl font-bold tracking-widest text-white">ARX</h1>
<p className="text-xs text-gray-500">Lending Command Center · Mantle</p>
</div>
<ConnectButton />
</div>

{/* Tabs */}
<div className="px-6 pt-6 flex gap-4 border-b border-gray-800">
<button
onClick={() => setActiveTab('dashboard')}
className={`text-sm pb-3 px-1 ${activeTab === 'dashboard' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white'}`}
>
Dashboard
</button>
<button
onClick={() => setActiveTab('simulate')}
className={`text-sm pb-3 px-1 ${activeTab === 'simulate' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-500 hover:text-white'}`}
>
Simulate
</button>
</div>

{/* Content */}
{activeTab === 'dashboard' && <Dashboard />}
{activeTab === 'simulate' && <Simulate />}
</main>
);
}
