import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
try {
const { healthFactor, supplyApy, borrowApy, totalSupply, totalDebt } = await req.json();

const netExposure = totalSupply - totalDebt;
const utilizationRate = totalDebt > 0 ? ((totalDebt / totalSupply) * 100).toFixed(1) : "0";

const prompt = `You are ARX, an autonomous DeFi lending agent on Mantle network. Analyze this Aave V3 position and give a sharp, actionable assessment.

Position data:
- Health Factor: ${healthFactor.toFixed(2)}
- Total Supplied: $${totalSupply.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()}
- Net Exposure: $${netExposure.toLocaleString()}
- Utilization Rate: ${utilizationRate}%
- Supply APY: ${supplyApy}%
- Borrow APY: ${borrowApy}%

Decision rules:
- HF < 1.2: action=REPAY, urgency=high — liquidation imminent
- HF 1.2-1.5: action=REBALANCE, urgency=medium — reduce exposure
- HF 1.5-2.0: action=HOLD, urgency=low — monitor closely
- HF > 2.0 with high utilization (>60%): action=OPTIMIZE, urgency=low — consider rebalancing debt
- HF > 2.0 with low utilization (<30%): action=SUPPLY, urgency=low — room to increase position

Be concise. 1-2 sentences max for reason. Specific dollar amounts in suggestion.

Respond ONLY in this JSON format:
{
"action": "HOLD|REPAY|SUPPLY|REBALANCE|OPTIMIZE",
"urgency": "low|medium|high",
"reason": "concise analysis referencing actual numbers",
"suggestion": "specific actionable step with amounts"
}`;

const completion = await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
messages: [{ role: "user", content: prompt }],
response_format: { type: "json_object" },
});

const content = completion.choices[0].message.content || "{}";
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
