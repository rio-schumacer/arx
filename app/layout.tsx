import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from './providers/wagmi';

export const metadata: Metadata = {
title: 'Arx — Lending Command Center',
description: 'Manage all your lending positions on Mantle',
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body className="w-full min-h-screen bg-[#0a0a0f]">
<Web3Provider>
{children}
</Web3Provider>
</body>
</html>
);
}
