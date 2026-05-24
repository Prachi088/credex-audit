import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: Promise<{ id: string }>
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
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-1">AI Spend Audit Report</h1>
      <p className="text-gray-500 text-sm mb-8">
        Generated on {new Date(data.created_at).toLocaleDateString()}
      </p>

      <div className="bg-black text-white rounded-2xl p-8 mb-8 text-center">
        <p className="text-gray-400 mb-2">Potential monthly savings</p>
        <p className="text-6xl font-bold mb-1">
          ${result.totalMonthlySavings}
          <span className="text-2xl font-normal text-gray-400">/mo</span>
        </p>
        <p className="text-gray-400 text-lg">
          ${result.totalAnnualSavings} per year
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Breakdown</h2>
      {result.perTool.map((tool: any) => (
        <div key={tool.toolId} className="border rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">{tool.toolName}</h3>
            <span className="text-sm px-3 py-1 rounded-full border bg-gray-50">
              {tool.severity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-500">Current spend</p>
              <p className="font-semibold">${tool.currentSpend}/mo</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Potential savings</p>
              <p className="font-semibold text-green-600">
                {tool.savings > 0 ? `$${tool.savings}/mo` : "—"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">{tool.recommendedAction}</p>
            <p className="text-sm text-gray-500">{tool.reason}</p>
          </div>
        </div>
      ))}

      <div className="mt-8 text-center">
        <a href="/" className="text-indigo-600 hover:underline text-sm">
          Run your own audit
        </a>
      </div>
    </main>
  )
}