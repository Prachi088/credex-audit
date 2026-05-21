export type ToolEntry = {
  toolId: string
  plan: string
  monthlySpend: number
  seats: number
}

export type FormState = {
  tools: ToolEntry[]
  teamSize: number
  useCase: string
}