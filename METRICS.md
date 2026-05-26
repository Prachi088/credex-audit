# METRICS.md

## North Star Metric

**Audits completed per week**

Why: An audit completion means a user got value from the product — they saw their savings number. Everything else (email captures, Credex consultations, credit purchases) flows from this. If audits completed is growing, the product is working. If it's flat, nothing else matters.

DAU is wrong for this product — people audit their AI spend once a quarter, not daily. Audit completions is the right unit.

## 3 Input Metrics that drive the North Star

**1. Homepage → Audit start rate**
The % of visitors who click at least one tool and begin filling the form. Target: >40%. If this is low, the homepage copy or tool selector UX is the problem.

**2. Audit start → Audit completion rate**
The % of users who start the form and click "Run My Audit". Target: >60%. If this is low, the form is too long or confusing.

**3. Shareable link share rate**
The % of completed audits where the user clicks "Copy shareable link". Target: >15%. This drives the viral loop — every shared link is free distribution.

## What I'd instrument first

1. **Posthog or Mixpanel events:**
   - `audit_started` — user clicks first tool
   - `audit_completed` — user clicks Run My Audit
   - `email_captured` — user submits email
   - `share_link_copied` — user clicks Copy shareable link
   - `consultation_booked` — user clicks Book Credex Consultation

2. **Funnel view:** homepage → audit start → audit complete → email capture → consultation booked

3. **Supabase query:** weekly audit completions, average savings per audit, % of audits showing >$500 savings

## What number triggers a pivot decision

**If audit completion rate drops below 30% for 2 consecutive weeks** → the form is broken or too complex. Simplify to 3 fields maximum and retest.

**If email capture rate drops below 10% of completions** → users aren't finding enough value to share their email. Either the savings numbers are too low (audit engine problem) or the email gate UX is wrong.

**If shareable link share rate is below 5%** → the results page isn't compelling enough to share. Redesign the hero savings display.

**If 0 Credex consultations booked after 500 audits** → the Credex CTA is not resonating or the $500 threshold is too high. Lower threshold to $200 and retest.