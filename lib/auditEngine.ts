import { FormState, ToolEntry } from "@/types"

export type ToolAuditResult = {
  toolId: string
  toolName: string
  currentSpend: number
  recommendedAction: string
  savings: number
  reason: string
  severity: "high" | "medium" | "low" | "optimal"
}

export type AuditResult = {
  perTool: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  showCredex: boolean
}

const PRICING: Record<string, Record<string, number>> = {
  "cursor": { "Hobby": 0, "Pro": 20, "Business": 40, "Enterprise": 40 },
  "github-copilot": { "Individual": 10, "Business": 19, "Enterprise": 39 },
  "claude": { "Free": 0, "Pro": 20, "Max": 100, "Team": 25, "Enterprise": 60, "API Direct": 0 },
  "chatgpt": { "Plus": 20, "Team": 30, "Enterprise": 60, "API Direct": 0 },
  "anthropic-api": { "Pay as you go": 0 },
  "openai-api": { "Pay as you go": 0 },
  "gemini": { "Pro": 20, "Ultra": 300, "API": 0 },
  "windsurf": { "Free": 0, "Pro": 15, "Teams": 35 },
}

const TOOL_NAMES: Record<string, string> = {
  "cursor": "Cursor",
  "github-copilot": "GitHub Copilot",
  "claude": "Claude",
  "chatgpt": "ChatGPT",
  "anthropic-api": "Anthropic API Direct",
  "openai-api": "OpenAI API Direct",
  "gemini": "Gemini",
  "windsurf": "Windsurf",
}

function auditTool(entry: ToolEntry, teamSize: number, useCase: string): ToolAuditResult {
  const { toolId, plan, monthlySpend, seats } = entry
  const toolName = TOOL_NAMES[toolId] || toolId
  const officialPrice = PRICING[toolId]?.[plan] ?? 0
  const expectedSpend = officialPrice * seats

  if (monthlySpend > expectedSpend * 1.1 && expectedSpend > 0) {
    const savings = monthlySpend - expectedSpend
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: `Review your billing — expected $${expectedSpend}/mo for ${seats} seats on ${plan}`,
      savings,
      reason: "You're overpaying vs official pricing.",
      severity: savings > 50 ? "high" : "medium"
    }
  }

  if (toolId === "cursor" && plan === "Business" && seats <= 2) {
    const savings = (40 - 20) * seats
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Cursor Pro ($20/seat)",
      savings,
      reason: "Business plan is for teams >10. Pro has same features for small teams.",
      severity: "high"
    }
  }

  if (toolId === "github-copilot" && plan === "Business" && seats <= 2) {
    const savings = (19 - 10) * seats
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: "Switch to GitHub Copilot Individual ($10/seat)",
      savings,
      reason: "Business adds org management you don't need with 2 users.",
      severity: "medium"
    }
  }

  if (toolId === "chatgpt" && plan === "Team" && seats <= 2) {
    const savings = (30 - 20) * seats
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: "Switch to ChatGPT Plus ($20/seat)",
      savings,
      reason: "Team plan benefits aren't useful under 3 users.",
      severity: "medium"
    }
  }

  if (toolId === "gemini" && plan === "Ultra" && useCase === "coding") {
    const savings = (300 - 20) * seats
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: "Switch to Cursor Pro ($20/seat) for coding",
      savings,
      reason: "Gemini Ultra is for research/multimodal. Cursor Pro is far better value for coding.",
      severity: "high"
    }
  }

  if (toolId === "claude" && plan === "Max" && seats <= 3) {
    const savings = (100 - 20) * seats
    return {
      toolId, toolName, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Claude Pro ($20/seat)",
      savings,
      reason: "Claude Max is for power users. Most teams don't hit Pro limits.",
      severity: "medium"
    }
  }

  return {
    toolId, toolName, currentSpend: monthlySpend,
    recommendedAction: "No changes needed",
    savings: 0,
    reason: "You're on the right plan for your usage.",
    severity: "optimal"
  }
}

export function runAudit(form: FormState): AuditResult {
  const perTool = form.tools.map(entry =>
    auditTool(entry, form.teamSize, form.useCase)
  )

  const totalMonthlySavings = perTool.reduce((sum, t) => sum + t.savings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    perTool,
    totalMonthlySavings,
    totalAnnualSavings,
    showCredex: totalMonthlySavings > 500
  }
}