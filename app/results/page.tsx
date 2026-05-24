"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AuditResult, ToolAuditResult } from "@/lib/auditEngine"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EmailCapture from "@/components/EmailCapture"

export default function Results() {
  const [result, setResult] = useState<AuditResult | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const router = useRouter()

  const loadAudit = useCallback(async () => {
    const savedResult = localStorage.getItem("credex-result")
    const savedForm = localStorage.getItem("credex-form")
    if (!savedResult) { router.push("/"); return }

    const parsedResult = JSON.parse(savedResult)
    const form = savedForm ? JSON.parse(savedForm) : {}
    setResult(parsedResult)

    // Save to Supabase
    const saveRes = await fetch("/api/save-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tools: form.tools,
        result: parsedResult,
        teamSize: form.teamSize,
      })
    })
    const saveData = await saveRes.json()
    if (saveData.id) setShareUrl(`${window.location.origin}/audit/${saveData.id}`)

    // Get AI summary
    setLoadingSummary(true)
    const sumRes = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result: parsedResult,
        teamSize: form.teamSize,
        useCase: form.useCase
      })
    })
    const sumData = await sumRes.json()
    setSummary(sumData.summary)
    setLoadingSummary(false)
  }, [router])

  useEffect(() => {
    loadAudit()
  }, [loadAudit])

  if (!result) return <div className="p-8">Loading...</div>

  const severityColor = (s: string) => {
    if (s === "high") return "text-red-600 bg-red-50 border-red-200"
    if (s === "medium") return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (s === "optimal") return "text-green-600 bg-green-50 border-green-200"
    return "text-blue-600 bg-blue-50 border-blue-200"
  }

  const severityLabel = (s: string) => {
    if (s === "high") return "⚠️ High savings"
    if (s === "medium") return "💡 Optimize"
    if (s === "optimal") return "✅ Optimal"
    return "ℹ️ Review"
  }

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      alert("Link copied!")
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="bg-black text-white rounded-2xl p-8 mb-8 text-center">
        <p className="text-gray-400 mb-2">You could save</p>
        <p className="text-6xl font-bold mb-1">
          ${result.totalMonthlySavings.toFixed(0)}
          <span className="text-2xl font-normal text-gray-400">/mo</span>
        </p>
        <p className="text-gray-400 text-lg mb-4">
          ${result.totalAnnualSavings.toFixed(0)} per year
        </p>
        {shareUrl && (
          <button
            onClick={copyShareUrl}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition"
          >
            🔗 Copy shareable link
          </button>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">
          AI Analysis
        </h2>
        {loadingSummary ? (
          <div className="animate-pulse h-16 bg-indigo-100 rounded-lg" />
        ) : (
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        )}
      </div>

      {result.showCredex && (
        <div className="bg-indigo-600 text-white rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">
            You&apos;re leaving serious money on the table 💸
          </h2>
          <p className="text-indigo-200 mb-4">
            Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise
            and more — at substantial discounts.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
            Book a Credex Consultation →
          </Button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Your Audit Breakdown</h2>
      {result.perTool.map((tool: ToolAuditResult) => (
        <Card key={tool.toolId} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>{tool.toolName}</span>
              <span className={`text-sm px-3 py-1 rounded-full border ${severityColor(tool.severity)}`}>
                {severityLabel(tool.severity)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Current spend</p>
                <p className="font-semibold">${tool.currentSpend}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Potential savings</p>
                <p className={`font-semibold ${tool.savings > 0 ? "text-green-600" : "text-gray-600"}`}>
                  {tool.savings > 0 ? `$${tool.savings}/mo` : "—"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">{tool.recommendedAction}</p>
              <p className="text-sm text-gray-500">{tool.reason}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {result.totalMonthlySavings === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h3 className="text-lg font-bold text-green-800 mb-1">You&apos;re spending well!</h3>
          <p className="text-green-700">Your AI tool stack looks optimized.</p>
        </div>
      )}

      <Button className="w-full mb-4" onClick={() => setShowEmailCapture(true)}>
        📧 Get my full report by email
      </Button>

      <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
        ← Run Another Audit
      </Button>

      {showEmailCapture && (
        <EmailCapture
          auditId={shareUrl ? shareUrl.split("/").pop() ?? null : null}
          totalSavings={result.totalMonthlySavings}
          onClose={() => setShowEmailCapture(false)}
        />
      )}
    </main>
  )
}