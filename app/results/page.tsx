 
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AuditResult, ToolAuditResult } from "@/lib/auditEngine"
import { Button } from "@/components/ui/button"
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
    const saveRes = await fetch("/api/save-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tools: form.tools, result: parsedResult, teamSize: form.teamSize })
    })
    const saveData = await saveRes.json()
    if (saveData.id) setShareUrl(`${window.location.origin}/audit/${saveData.id}`)
    setLoadingSummary(true)
    const sumRes = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: parsedResult, teamSize: form.teamSize, useCase: form.useCase })
    })
    const sumData = await sumRes.json()
    setSummary(sumData.summary)
    setLoadingSummary(false)
  }, [router])

  useEffect(() => {
    loadAudit()
  }, [loadAudit])

  if (!result) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
      <p className="text-slate-400">Loading your audit...</p>
    </div>
  )

  const severityColor = (s: string) => {
    if (s === "high") return "text-red-400 bg-red-500/10 border-red-500/20"
    if (s === "medium") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    if (s === "optimal") return "text-green-400 bg-green-500/10 border-green-500/20"
    return "text-blue-400 bg-blue-500/10 border-blue-500/20"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <header className="border-b border-white/10 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-white font-semibold">AI Spend Audit</span>
          </div>
          <button onClick={() => router.push("/")} className="text-slate-400 hover:text-white text-sm transition-colors">
            New Audit
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-10 mb-8 text-center shadow-2xl shadow-indigo-500/20">
          <p className="text-indigo-200 text-sm mb-3 uppercase tracking-widest font-medium">You could save</p>
          <p className="text-7xl font-bold text-white mb-2">
            ${result.totalMonthlySavings.toFixed(0)}
            <span className="text-3xl font-normal text-indigo-300">/mo</span>
          </p>
          <p className="text-indigo-300 text-lg mb-6">${result.totalAnnualSavings.toFixed(0)} per year</p>
          {shareUrl && (
            <button onClick={copyShareUrl} className="bg-white/10 hover:bg-white/20 text-white text-sm px-5 py-2.5 rounded-full transition-all border border-white/20">
              🔗 Copy shareable link
            </button>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">AI Analysis</h2>
          {loadingSummary ? (
            <div className="space-y-2">
              <div className="animate-pulse h-4 bg-white/10 rounded w-full" />
              <div className="animate-pulse h-4 bg-white/10 rounded w-4/5" />
              <div className="animate-pulse h-4 bg-white/10 rounded w-3/5" />
            </div>
          ) : (
            <p className="text-slate-300 leading-relaxed">{summary}</p>
          )}
        </div>

        {result.showCredex && (
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-white text-xl font-bold mb-2">Capture these savings with Credex 💸</h2>
            <p className="text-slate-400 mb-4">Credex sells discounted AI credits at substantial discounts.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
              Book a Credex Consultation →
            </a>
          </div>
        )}

        <h2 className="text-white text-2xl font-bold mb-4">Your Audit Breakdown</h2>
        {result.perTool.map((tool: ToolAuditResult) => (
          <div key={tool.toolId} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">{tool.toolName}</h3>
              <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${severityColor(tool.severity)}`}>
                {severityLabel(tool.severity)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-500 text-xs mb-1">Current spend</p>
                <p className="text-white font-semibold">${tool.currentSpend}/mo</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Potential savings</p>
                <p className={`font-semibold ${tool.savings > 0 ? "text-green-400" : "text-slate-500"}`}>
                  {tool.savings > 0 ? `$${tool.savings}/mo` : "—"}
                </p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-slate-300 text-sm font-medium mb-1">{tool.recommendedAction}</p>
              <p className="text-slate-500 text-sm">{tool.reason}</p>
            </div>
          </div>
        ))}

        {result.totalMonthlySavings === 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <h3 className="text-green-400 text-lg font-bold mb-1">You&apos;re spending well!</h3>
            <p className="text-slate-400">Your AI tool stack looks optimized.</p>
          </div>
        )}

        <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-4 rounded-xl mb-3 transition-colors"
          onClick={() => setShowEmailCapture(true)}>
          📧 Get my full report by email
        </button>

        <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white" onClick={() => router.push("/")}>
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
    </div>
  )
}