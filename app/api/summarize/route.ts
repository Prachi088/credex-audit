import Groq from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function POST(req: NextRequest) {
  try {
    const { result, useCase, teamSize } = await req.json()

    const toolSummary = result.perTool
       .map((t: {toolName: string, currentSpend: number, savings: number, recommendedAction: string}) => `${t.toolName}: $${t.currentSpend}/mo, savings $${t.savings}/mo — ${t.recommendedAction}`)
      .join("\n")

    const prompt = `You are an AI spend analyst. Write a 100-word personalized audit summary for a team.

Team size: ${teamSize}
Primary use case: ${useCase}
Total monthly savings potential: $${result.totalMonthlySavings}
Annual savings potential: $${result.totalAnnualSavings}

Per-tool breakdown:
${toolSummary}

Write a friendly, direct 100-word summary paragraph. Be specific about the biggest savings opportunity. End with one actionable next step. No bullet points, just prose.`

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }]
    })

    const summary = completion.choices[0]?.message?.content
      ?? "Your AI tool stack has room for optimization. Review the recommendations above to capture savings."

    return NextResponse.json({ summary })
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      summary: "Based on your current AI tool usage, there are opportunities to optimize your spend. Review the per-tool recommendations above and consider switching to more cost-effective plans for your team size and use case."
    })
  }
}