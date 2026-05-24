"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  auditId: string | null
  totalSavings: number
  onClose: () => void
}

export default function EmailCapture({ auditId, totalSavings, onClose }: Props) {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    try {
      await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, auditId, totalSavings })
      })
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {done ? (
          <div className="text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="text-2xl font-bold mb-2">Report sent!</h2>
            <p className="text-gray-500 mb-6">
              Check your inbox for your audit report.
              {totalSavings > 500 && " Our team will reach out about Credex savings."}
            </p>
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Get your full report</h2>
            <p className="text-gray-500 mb-6">
              We&apos;ll email you the complete audit with recommendations.
              {totalSavings > 500 && " A Credex advisor will also reach out about your $" + totalSavings + "/mo savings opportunity."}
            </p>

            <div className="space-y-4">
              <div>
                <Label className="mb-1 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-1 block">Company (optional)</Label>
                <Input
                  placeholder="Acme Inc"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-1 block">Role (optional)</Label>
                <Input
                  placeholder="CTO / Engineering Manager"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!email || loading}
              >
                {loading ? "Sending..." : "Send my report →"}
              </Button>

              <button
                onClick={onClose}
                className="w-full text-sm text-gray-400 hover:text-gray-600"
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}