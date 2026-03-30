import { NextRequest, NextResponse } from "next/server";
import { getUserAccountData, WHALE_ADDRESSES } from "@/app/lib/aave";

export async function GET(req: NextRequest) {
const { searchParams } = new URL(req.url);
const address = searchParams.get("address");

if (!address) {
return NextResponse.json({ error: "Address required" }, { status: 400 });
}

const data = await getUserAccountData(address);
if (!data) {
return NextResponse.json({ error: "No position found" }, { status: 404 });
}

return NextResponse.json(data);
}

export async function POST() {
const results = await Promise.all(
WHALE_ADDRESSES.map((addr) => getUserAccountData(addr))
);
return NextResponse.json(results.filter(Boolean));
}
