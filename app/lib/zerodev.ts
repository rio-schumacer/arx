import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/sdk/signers";
import { http, createPublicClient } from "viem";
import { defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

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

export async function createSmartAccount(signer: ReturnType<typeof privateKeyToAccount>) {
const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
signer,
entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
});

const account = await createKernelAccount(publicClient, {
plugins: {
sudo: ecdsaValidator,
},
entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
});

const paymasterClient = createZeroDevPaymasterClient({
chain: mantleSepolia,
transport: http(PAYMASTER_RPC),
entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
});

const kernelClient = createKernelAccountClient({
account,
chain: mantleSepolia,
bundlerTransport: http(BUNDLER_RPC),
middleware: {
sponsorUserOperation: paymasterClient.sponsorUserOperation,
},
});

return { account, kernelClient };
}
