# PROMPTS.md

## AI Summary Prompt

Used in `app/api/summarize/route.ts` via Groq API (llama-3.3-70b-versatile).

### Final Prompt

You are an AI spend analyst. Write a 100-word personalized audit summary for a team.
Team size: ${teamSize}
Primary use case: ${useCase}
Total monthly savings potential: $${result.totalMonthlySavings}
Annual savings potential: $${result.totalAnnualSavings}
Per-tool breakdown:
${toolSummary}
Write a friendly, direct 100-word summary paragraph. Be specific about the biggest savings opportunity. End with one actionable next step. No bullet points, just prose.

### Why I wrote it this way
- Gave the model a clear role ("AI spend analyst") to anchor tone
- Injected structured data (team size, use case, per-tool breakdown) so the model generates specific rather than generic output
- Specified "100-word" to keep output concise and scannable
- "No bullet points, just prose" prevents the model from reformatting into a list
- "End with one actionable next step" ensures the summary has a clear CTA

### What I tried that didn't work
- Without the role definition, the model produced generic "consider your options" style text
- Without specifying word count, responses were either too long (300+ words) or too short (2 sentences)
- Without "be specific about the biggest savings opportunity", the model summarized all tools equally instead of highlighting the highest-impact one

### Model choice
Originally tried Anthropic API (claude-sonnet-4-5) but account had insufficient credits. Switched to Groq (free tier) with llama-3.3-70b-versatile which produces comparable quality for this use case.

### Fallback behavior
If the API call fails for any reason (rate limit, network error, invalid response), the route returns a templated fallback summary:

"Based on your current AI tool usage, there are opportunities to optimize your spend. Review the per-tool recommendations above and consider switching to more cost-effective plans for your team size and use case."

This ensures the results page always shows something useful even if the AI call fails.