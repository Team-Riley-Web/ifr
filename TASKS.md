# Tasks

Queue of work for Claude. Add new tasks to the bottom. Do not remove or edit an
unchecked task unless you are starting it.

## Rules
- Work on only one task at a time.
- New tasks go at the bottom of the list.
- Do not abandon or interrupt the current task unless the user explicitly says "interrupt".
- Finish, test, and verify the current task before starting the next.
- Before starting another task, re-read this file and select the oldest pending (unchecked) task.
- After completing a task, check it off, briefly tell the user it's done, and state which task is starting next.
- Do not combine unrelated tasks into one implementation.
- When you check a task off, indent a short `Done YYYY-MM-DD:` note under it saying what
  actually changed. If the task cannot be finished, leave it unchecked and add a
  `Blocked YYYY-MM-DD:` note explaining what is needed to unblock it.

## Queue
- [x] Keep users signed in for 30 days instead of getting logged out (extend session lifetime from 7 to 30 days).
  - Done 2026-09-19: Bumped `SESSION_DAYS` in `web/src/lib/auth.ts` from 7 to 30. Both the session-store expiry and the `ifr_session` cookie `maxAge` derive from this single constant, so both now last 30 days. Verified with `npm run build`.
- [ ] Remember video playback position per lesson so resuming a video continues where the user left off instead of restarting from 0:00.
