import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tools, result, teamSize, useCase } = body

    const { data, error } = await supabase
      .from("audits")
      .insert({
        tools,
        result,
        team_size: String(teamSize),
        is_public: true
      })
      .select("id")
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 })
  }
}