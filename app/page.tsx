"use client"

import { useState, useEffect } from "react"
import { TOOLS, USE_CASES } from "@/lib/tools"
import { FormState, ToolEntry } from "@/types"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const defaultForm: FormState = {
  tools: [],
  teamSize: 1,
  useCase: "mixed"
}

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultForm)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("credex-form")
    if (saved) setForm(JSON.parse(saved))
  }, [])

  // Save to localStorage on every change
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

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">AI Spend Audit</h1>
      <p className="text-gray-500 mb-8">Find out where you're overpaying on AI tools.</p>

      {/* Tool selector */}
      <div className="mb-6">
        <Label className="mb-2 block">Which AI tools do you pay for?</Label>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => addTool(tool.id)}
              className={`px-3 py-1 rounded-full border text-sm ${
                form.tools.find(t => t.toolId === tool.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {tool.name}
            </button>
          ))}
        </div>
      </div>

      {/* Per-tool inputs */}
      {form.tools.map(entry => {
        const tool = TOOLS.find(t => t.id === entry.toolId)!
        return (
          <Card key={entry.toolId} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                {tool.name}
                <button onClick={() => removeTool(entry.toolId)} className="text-sm text-red-500">Remove</button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select onValueChange={v => updateTool(entry.toolId, "plan", v)}>
                  <SelectTrigger>
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
                <Label>Monthly Spend ($)</Label>
                <Input
                  type="number"
                  value={entry.monthlySpend}
                  onChange={e => updateTool(entry.toolId, "monthlySpend", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Seats</Label>
                <Input
                  type="number"
                  value={entry.seats}
                  onChange={e => updateTool(entry.toolId, "seats", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Team size + use case */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <Label>Team Size</Label>
          <Input
            type="number"
            value={form.teamSize}
            onChange={e => setForm(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label>Primary Use Case</Label>
          <Select onValueChange={v => setForm(prev => ({ ...prev, useCase: v }))}>
            <SelectTrigger>
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

      <Button size="lg" className="w-full" disabled={form.tools.length === 0}>
        Run My Audit →
      </Button>
    </main>
  )
}