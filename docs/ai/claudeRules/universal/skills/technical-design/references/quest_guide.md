# Questions Rules

## Generate question
Generate (internally) a prioritized queue of candidate clarification questions (maximum 5). Do NOT output them all at once. Apply these constraints:
- Each question must be answerable with EITHER:
       - A short multiple‑choice selection (2–5 distinct, mutually exclusive options), OR
       - A one-word / short‑phrase answer (explicitly constrain: "Answer in <=5 words").
- Only include questions whose answers materially impact architecture, data modeling, task decomposition, test design, UX behavior, operational readiness, or compliance validation.
- Ensure category coverage balance: attempt to cover the highest impact unresolved categories first; avoid asking two low-impact questions when a single high-impact area (e.g., security posture) is unresolved.
- Exclude questions already answered, trivial stylistic preferences, or plan-level execution details (unless blocking correctness).
- Favor clarifications that reduce downstream rework risk or prevent misaligned acceptance tests.

## Sequential questioning loop (interactive):
- Present EXACTLY ONE question at a time.
- For multiple‑choice questions:
    - **Analyze all options** and determine the **most suitable option** based on:
        - Best practices for the project type
        - Common patterns in similar implementations
        - Risk reduction (security, performance, maintainability)
        - Alignment with any explicit project goals or constraints visible in the spec
    - Present your **recommended option prominently** at the top with clear reasoning (1-2 sentences explaining why this is the best choice).
    - Format as: `**Recommended:** Option [X] - <reasoning>`
    - Then render all options as a Markdown table:

    | Option | Description |
    |--------|-------------|
    | A | <Option A description> |
    | B | <Option B description> |
    | C | <Option C description> (add D/E as needed up to 5) |
    | Short | Provide a different short answer (<=5 words) (Include only if free-form alternative is appropriate) |

    - After the table, add: `You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.`
- For short‑answer style (no meaningful discrete options):
    - Provide your **suggested answer** based on best practices and context.
    - Format as: `**Suggested:** <your proposed answer> - <brief reasoning>`
    - Then output: `Format: Short answer (<=5 words). You can accept the suggestion by saying "yes" or "suggested", or provide your own answer.`
- After the user answers:
    - If the user replies with "yes", "recommended", or "suggested", use your previously stated recommendation/suggestion as the answer.
    - Otherwise, validate the answer maps to one option or fits the <=5 word constraint.
    - If ambiguous, ask for a quick disambiguation (count still belongs to same question; do not advance).
    - Once satisfactory, record it in working memory (do not yet write to disk) and move to the next queued question.
- Stop asking further questions when:
    - All critical ambiguities resolved early (remaining queued items become unnecessary), OR
    - User signals completion ("done", "good", "no more"), OR
    - You reach 5 asked questions.
- Never reveal future queued questions in advance.
- If no valid questions exist at start, immediately report no critical ambiguities.