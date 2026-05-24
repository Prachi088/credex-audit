import { describe, it, expect } from "vitest"
import { runAudit } from "../lib/auditEngine"

describe("Audit Engine", () => {
  it("detects Cursor Business overkill for small team", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: "coding"
    })
    expect(result.totalMonthlySavings).toBe(40)
    expect(result.perTool[0].severity).toBe("high")
  })

  it("detects Claude Max overkill for small team", () => {
    const result = runAudit({
      tools: [{ toolId: "claude", plan: "Max", monthlySpend: 200, seats: 2 }],
      teamSize: 2,
      useCase: "writing"
    })
    expect(result.totalMonthlySavings).toBe(160)
    expect(result.perTool[0].severity).toBe("medium")
  })

  it("marks optimal tools correctly", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding"
    })
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.perTool[0].severity).toBe("optimal")
  })

  it("calculates annual savings correctly", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: "coding"
    })
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })
it("shows Credex CTA when savings exceed $500", () => {
    const result = runAudit({
      tools: [
        { toolId: "gemini", plan: "Ultra", monthlySpend: 900, seats: 3 },
      ],
      teamSize: 3,
      useCase: "coding"
    })
    expect(result.showCredex).toBe(true)
  })
  it("detects GitHub Copilot Business overkill for small team", () => {
    const result = runAudit({
      tools: [{ toolId: "github-copilot", plan: "Business", monthlySpend: 38, seats: 2 }],
      teamSize: 2,
      useCase: "coding"
    })
    expect(result.totalMonthlySavings).toBe(18)
    expect(result.perTool[0].severity).toBe("medium")
  })
})