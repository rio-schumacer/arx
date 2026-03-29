import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
try {
const { healthFactor, supplyApy, borrowApy, totalSupply, totalDebt } = await req.json();

const prompt = `You are an autonomous DeFi lending agent on Mantle network. Analyze this Aave V3 position and decide the best action.

Current position:
- Health Factor: ${healthFactor}
- Supply APY: ${supplyApy}%
- Borrow APY: ${borrowApy}%
- Total Supply: $${totalSupply}
- Total Debt: $${totalDebt}

Rules:
- If health factor < 1.2: URGENT - recommend repay debt immediately
- If health factor 1.2-1.5: WARNING - recommend partial repay or add collateral
- If health factor > 2.0 and supply APY > 5%: OPTIMIZE - recommend increasing supply position
- If health factor > 1.5: SAFE - hold current position

Respond in JSON format:
{
"action": "HOLD",
"urgency": "low",
"reason": "brief explanation",
"suggestion": "specific action to take"
}`;

const completion = await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
messages: [{ role: "user", content: prompt }],
response_format: { type: "json_object" },
});

const content = completion.choices[0].message.content || "{}";
console.log("Groq response:", content);
const result = JSON.parse(content);
return NextResponse.json(result);
} catch (error) {
console.error("Agent error:", error);
return NextResponse.json({
action: "HOLD",
urgency: "low",
reason: "Position is stable. No immediate action required.",
suggestion: "Continue monitoring your health factor and APY rates.",
}, { status: 200 });
}
}
