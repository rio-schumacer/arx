import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants";
import { http, createPublicClient } from "viem";
import { defineChain } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

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

const PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID!;
const BUNDLER_RPC = `https://rpc.zerodev.app/api/v2/bundler/${PROJECT_ID}`;
const PAYMASTER_RPC = `https://rpc.zerodev.app/api/v2/paymaster/${PROJECT_ID}`;

export const publicClient = createPublicClient({
chain: mantleSepolia,
transport: http("https://rpc.sepolia.mantle.xyz"),
});

export async function createSmartAccountFromBrowser() {
// Generate ephemeral session signer (demo mode)
// In production: use user's wallet signer
const sessionKey = generatePrivateKey();
const signer = privateKeyToAccount(sessionKey);

const entryPoint = getEntryPoint("0.7");

const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
signer,
entryPoint,
kernelVersion: KERNEL_V3_1,
});

const account = await createKernelAccount(publicClient, {
plugins: { sudo: ecdsaValidator },
entryPoint,
kernelVersion: KERNEL_V3_1,
});

const paymasterClient = createZeroDevPaymasterClient({
chain: mantleSepolia,
transport: http(PAYMASTER_RPC),
});

const kernelClient = createKernelAccountClient({
account,
chain: mantleSepolia,
bundlerTransport: http(BUNDLER_RPC),
paymaster: paymasterClient,
});

return { account, kernelClient, sessionAddress: signer.address };
}
