import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, company, role, auditId, totalSavings } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Update audit record with lead info
    if (auditId) {
      await supabase
        .from("audits")
        .update({ email, company, role })
        .eq("id", auditId)
    }

    // Send confirmation email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Your AI Spend Audit is ready</h1>
          <p>Hi${company ? ` from ${company}` : ""},</p>
          <p>Thanks for using AI Spend Audit. Here's your summary:</p>
          
          <div style="background: #000; color: #fff; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <p style="color: #94a3b8; margin: 0;">Potential monthly savings</p>
            <p style="font-size: 48px; font-weight: bold; margin: 8px 0;">$${totalSavings}/mo</p>
            <p style="color: #94a3b8; margin: 0;">$${totalSavings * 12} per year</p>
          </div>

          ${totalSavings > 500 ? `
          <div style="background: #4f46e5; color: #fff; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h2 style="margin: 0 0 8px;">You qualify for a Credex consultation</h2>
            <p style="color: #c7d2fe;">With $${totalSavings}/mo in potential savings, you're a strong candidate for Credex discounted AI credits. Our team will reach out shortly.</p>
          </div>
          ` : ""}

          <p>Review your full audit and share it with your team:</p>
          ${auditId ? `<a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/audit/${auditId}" style="background: #0f172a; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">View Full Report →</a>` : ""}
          
          <p style="color: #94a3b8; margin-top: 32px; font-size: 14px;">
            AI Spend Audit — powered by Credex
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 })
  }
}