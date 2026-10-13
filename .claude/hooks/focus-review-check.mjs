// SessionStart hook: flags when this month's focus-plan review is due.
// A review is due from the first of each month (starting FIRST_REVIEW_MONTH)
// until docs/focus-plan/reviews/YYYY-MM.md exists for that month.
// FOCUS_REVIEW_TODAY=YYYY-MM-DD overrides the date, for testing.
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PLAN = 'docs/focus-plan/2026-q4-focus-plan.md'
const REVIEWS_DIR = 'docs/focus-plan/reviews'
const FIRST_REVIEW_MONTH = '2026-11'

const root =
  process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const today = process.env.FOCUS_REVIEW_TODAY
  ? new Date(`${process.env.FOCUS_REVIEW_TODAY}T12:00:00`)
  : new Date()
const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

if (month < FIRST_REVIEW_MONTH) process.exit(0)
// The plan is gitignored (the repo is public), so clones without it stay quiet.
if (!existsSync(join(root, PLAN))) process.exit(0)

const reviewFile = `${REVIEWS_DIR}/${month}.md`
if (existsSync(join(root, reviewFile))) process.exit(0)

const label = today.toLocaleString('en-GB', { month: 'long', year: 'numeric' })

process.stdout.write(
  JSON.stringify({
    systemMessage: `Focus-plan review for ${label} is due (${reviewFile} not found).`,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext:
        `The monthly focus-plan review for ${label} is due: ${reviewFile} does not exist yet. ` +
        `At the start of your first reply, tell the user it is due and offer to run it now or after their current request. ` +
        `Do not start it ahead of what they asked. ` +
        `To run it: read ${PLAN} (the "Monthly review" section) and the most recent file in ${REVIEWS_DIR}/, ` +
        `ask the user for each owner's status on the checkpoint that just passed, ` +
        `then write ${reviewFile} from the template in the plan and update the plan's Status board. ` +
        `If the plan's end date has passed, this is the year-end review: score the year-end outcomes and help draft the next plan.`,
    },
  }),
)
