"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TOOLS, USE_CASES } from "@/lib/tools"
import { FormState, ToolEntry } from "@/types"
import { runAudit } from "@/lib/auditEngine"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const defaultForm: FormState = {
  tools: [],
  teamSize: 1,
  useCase: "mixed"
}

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("credex-form")
    if (saved) {
      const parsed = JSON.parse(saved)
      setForm(parsed)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("credex-form", JSON.stringify(form))
  }, [form])

  const addTool = (toolId: string) => {
    if (form.tools.find(t => t.toolId === toolId)) return
    setForm(prev => ({
      ...prev,
      tools: [...prev.tools, { toolId, plan: "", monthlySpend: 0, seats: 1 }]
    }))
  }

  const removeTool = (toolId: string) => {
    setForm(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.toolId !== toolId)
    }))
  }

  const updateTool = (toolId: string, field: keyof ToolEntry, value: string | number) => {
    setForm(prev => ({
      ...prev,
      tools: prev.tools.map(t =>
        t.toolId === toolId ? { ...t, [field]: value } : t
      )
    }))
  }

  const handleRunAudit = () => {
    const result = runAudit(form)
    localStorage.setItem("credex-result", JSON.stringify(result))
    localStorage.setItem("credex-form", JSON.stringify(form))
    router.push("/results")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-white font-semibold">AI Spend Audit</span>
          </div>
          <span className="text-slate-400 text-sm">by Credex</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full mb-6">
            Free — no login required
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Stop overpaying for<br />
            <span className="text-indigo-400">AI tools</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-xl mx-auto">
            2-minute audit shows exactly where your team is wasting money on Cursor, Claude, ChatGPT and more.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {/* Tool selector */}
          <div className="mb-8">
            <Label className="text-slate-300 text-sm font-medium mb-3 block">
              Which AI tools do you pay for?
            </Label>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => addTool(tool.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    form.tools.find(t => t.toolId === tool.id)
                      ? "bg-indigo-500 text-white border border-indigo-400"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:border-indigo-500/50 hover:text-white"
                  }`}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* Per tool inputs */}
          {form.tools.length > 0 && (
            <div className="space-y-4 mb-8">
              {form.tools.map(entry => {
                const tool = TOOLS.find(t => t.id === entry.toolId)!
                return (
                  <div key={entry.toolId} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-semibold">{tool.name}</span>
                      <button
                        onClick={() => removeTool(entry.toolId)}
                        className="text-slate-500 hover:text-red-400 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-400 text-xs mb-1.5 block">Plan</Label>
                        <Select onValueChange={v => updateTool(entry.toolId, "plan", v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {tool.plans.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs mb-1.5 block">Monthly Spend ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={entry.monthlySpend}
                          onChange={e => updateTool(entry.toolId, "monthlySpend", Number(e.target.value))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs mb-1.5 block">Seats</Label>
                        <Input
                          type="number"
                          min={1}
                          value={entry.seats}
                          onChange={e => updateTool(entry.toolId, "seats", Number(e.target.value))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Team size + use case */}
          {form.tools.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <Label className="text-slate-400 text-xs mb-1.5 block">Team Size</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.teamSize}
                  onChange={e => setForm(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs mb-1.5 block">Primary Use Case</Label>
                <Select onValueChange={v => setForm(prev => ({ ...prev, useCase: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select use case" />
                  </SelectTrigger>
                  <SelectContent>
                    {USE_CASES.map(u => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-6 text-lg rounded-xl"
            disabled={form.tools.length === 0}
            onClick={handleRunAudit}
          >
            Run My Audit →
          </Button>

          {form.tools.length === 0 && (
            <p className="text-center text-slate-500 text-sm mt-3">
              Select at least one tool to get started
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-8">
          Free forever · No login required · Powered by Credex
        </p>
      </main>
    </div>
  )
}