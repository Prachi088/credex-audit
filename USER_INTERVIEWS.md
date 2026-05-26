# USER_INTERVIEWS.md

## Interview 1 — A.K., 3rd Year CSE Student, SATI

**Date:** May 25, 2026
**Duration:** 6 minutes
**How contacted:** WhatsApp

### Direct quotes
- "I only pay when deadlines come."
- "After exams I forget I'm still subscribed."
- "The free version is fine most of the time honestly."

### Most surprising thing
He cancelled ChatGPT Plus after one month not because it was bad — but because usage dropped after exams ended. He had no idea he could have just paused instead of cancelling.

### What it changed about my design
Added seasonal/temporary upgrade recommendations to the audit engine — instead of only suggesting permanent plan changes, the tool now notes when a downgrade makes sense based on usage patterns.

---

## Interview 2 — R.S., Final Year Student Developer, SATI

**Date:** May 25, 2026
**Duration:** 8 minutes
**How contacted:** College friend, WhatsApp

### Direct quotes
- "I opened the billing page and realised I wasn't even using Copilot anymore."
- "I just kept paying because cancelling felt like effort."
- "ChatGPT does everything Copilot does for me anyway."

### Most surprising thing
He had been paying for GitHub Copilot for 2 months after switching to ChatGPT for coding. The overlap was invisible until he checked his bank statement.

### What it changed about my design
Added overlap detection to the audit engine — when a user pays for both GitHub Copilot and ChatGPT for coding, the tool now explicitly flags the overlap and recommends keeping only one.

---

## Interview 3 — P.V., 2nd Year IT Student, SATI

**Date:** May 25, 2026
**Duration:** 5 minutes
**How contacted:** WhatsApp

### Direct quotes
- "I don't know which paid AI tool is actually worth it."
- "Every review online just says everything is great."
- "I'd pay if I knew exactly what I was getting."

### Most surprising thing
He wasn't trying to reduce spend — he was trying to decide which single tool to pay for first. The audit tool framing of "you're overspending" didn't apply to him, but "here's the best tool for your use case" did.

### What it changed about my design
Added a "best tool for your use case" recommendation for users with $0 current spend — instead of showing $0 savings and nothing else, the tool now suggests which single tool to start with based on their use case.

---

## Interview 4 — M.T., Final Year Student, Placement Prep

**Date:** May 25, 2026
**Duration:** 7 minutes
**How contacted:** Placement group chat, WhatsApp

### Direct quotes
- "We split the payment because paying full price alone feels expensive."
- "I use it mainly for resume edits and aptitude prep."
- "I don't track how many hours I use it — I just know it helps."

### Most surprising thing
Account sharing was his primary cost reduction strategy — he had never considered that a cheaper plan might exist. He assumed all paid plans were the same price.

### What it changed about my design
Made pricing comparisons more prominent in recommendations — showing the exact price difference between plans rather than just naming the cheaper option.