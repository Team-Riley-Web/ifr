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
- [x] Remember video playback position per lesson so resuming a video continues where the user left off instead of restarting from 0:00.
  - Done 2026-09-19: Added a `playback_position` table (SQLite) / `playback/{userId}` blob key (Netlify), `getPlaybackPositions`/`setPlaybackPosition` in `web/src/lib/data.ts`, and a new `web/src/pages/api/playback-position.ts` GET/POST endpoint. The course player script (`web/src/pages/course/[courseId].astro`) now keys each video by `lessonId/tabId/fileIndex`, seeks to the saved position on load (skipping the last few seconds), and saves progress every 5s during playback plus on pause/ended/tab-hide/page-hide. Verified end-to-end with the dev server: setup/login, POST/GET round-trip and update on `/api/playback-position`, 400 on missing fields, 401 when unauthenticated, and confirmed the session cookie now expires in 30 days.
- [x] Add a "Sing the Numbers / Feel the Numbers" ear-training module that plays all of those audio tracks in order, back to back, with autoplay advancing to the next track.
  - Done 2026-09-19: Asked the user to clarify "Feel the Numbers" since no such label exists anywhere in the course data (closest candidates were the "Meditative"/"Advanced" tracks) — they said to skip it for now. Built a new "Sing the Numbers" course (`web/src/lib/courses.ts`, id `sing-the-numbers`) with one lesson per chord (1, 2-, 4, 5D, 6-, 7-b5) for each track explicitly labeled "Sing the Numbers" in the existing Seven Worlds data, in chord-progression order. Added an `autoAdvance` flag on `Course`; the course page (`web/src/pages/course/[courseId].astro`) now autoplays each track and, on `ended`, chains to the next file in the tab or calls a new `goToNextLesson()` (extracted from the existing next-lesson button) to advance lessons automatically — scoped only to courses with `autoAdvance: true` so no other course's behavior changed. Verified end-to-end against the dev server: course page renders all 6 lessons, and `/api/media/sing-the-numbers/<lesson>/main/0` resolves to the correct object key for all six (confirmed via "File Not Found" vs. a bogus lesson's "Not Found"). Note for the user: the 3- chord's "Ear Training Audio" track and the Harmonic Environment "Meditative"/"Advanced" tracks share the same underlying `ifr_sing_the_numbers_3_track_NN` numbering as the Sing the Numbers tracks, so they may be what "Feel the Numbers" refers to — worth a follow-up once that's confirmed.
- [ ] Investigate and fix mobile users still being asked to log in every time despite the 30-day session.
- [ ] Default each lesson to reopen on whichever tab (Main/Guitar/Piano/Ear Training/Audio) the user was last on, instead of always defaulting to Main.
