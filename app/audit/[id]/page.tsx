import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: Promise<{ id: string }>
}

type ToolResult = {
  toolId: string
  toolName: string
  severity: string
  currentSpend: number
  savings: number
  recommendedAction: string
  reason: string
}

export default async function PublicAudit({ params }: Props) {
  const { id } = await params

  const { data, error } = await supabase
    .from("audits")
    .select("result, created_at")
    .eq("id", id)
    .eq("is_public", true)
    .single()

  if (error || !data) return notFound()

  const result = data.result

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <header className="border-b border-white/10 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-white font-semibold">AI Spend Audit</span>
          </div>
          <span className="text-slate-500 text-sm">by Credex</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">AI Spend Audit Report</h1>
          <p className="text-slate-500 text-sm">
            Generated on {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-10 mb-8 text-center shadow-2xl shadow-indigo-500/20">
          <p className="text-indigo-200 text-sm mb-3 uppercase tracking-widest font-medium">Potential monthly savings</p>
          <p className="text-7xl font-bold text-white mb-2">
            ${result.totalMonthlySavings}
            <span className="text-3xl font-normal text-indigo-300">/mo</span>
          </p>
          <p className="text-indigo-300 text-lg">${result.totalAnnualSavings} per year</p>
        </div>

        {result.showCredex && (
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-white text-xl font-bold mb-2">Capture these savings with Credex 💸</h2>
            <p className="text-slate-400 mb-4">Credex sells discounted AI credits at substantial savings.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
              Visit Credex →
            </a>
          </div>
        )}

        <h2 className="text-white text-2xl font-bold mb-4">Breakdown</h2>
        {result.perTool.map((tool: ToolResult) => (
          <div key={tool.toolId} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">{tool.toolName}</h3>
              <span className="text-xs px-3 py-1.5 rounded-full border bg-white/5 border-white/10 text-slate-400 font-medium">
                {tool.severity}
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

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            Run your own free audit →
          </Link>
        </div>
      </main>
    </div>
  )
}