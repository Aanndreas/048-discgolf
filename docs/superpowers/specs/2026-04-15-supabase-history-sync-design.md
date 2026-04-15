# Design: Supabase History Sync

**Date:** 2026-04-15  
**Status:** Approved

## Problem

History (completed rounds) is stored in `localStorage` — per-device, per-browser. A round played on one phone is invisible to everyone else. The goal is to sync history across all devices for the friend group with zero cost and zero auth complexity.

## Scope

- Sync completed rounds to a shared Supabase Postgres database
- Active game state stays in localStorage (no live sync needed)
- No authentication — public read/write for now
- Migrate existing localStorage history to Supabase on first load

Out of scope: real-time live scoring, user accounts, per-user filtering.

## Architecture

Vite React app calls Supabase directly via `@supabase/supabase-js`. No serverless functions, no backend. The anon key is safe to expose with RLS disabled for a trusted friend group.

```
React app  →  @supabase/supabase-js  →  Supabase Postgres (rounds table)
```

Env vars on Vercel (and locally in `.env.local`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Data Model

```sql
CREATE TABLE rounds (
  id          TEXT        PRIMARY KEY,
  course_name TEXT        NOT NULL,
  course_id   TEXT,
  date        TEXT        NOT NULL,
  players     JSONB       NOT NULL,
  scores      JSONB       NOT NULL,
  winner      TEXT        NOT NULL,
  holes       INT         NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS off for now (public friend group, no auth)
ALTER TABLE rounds DISABLE ROW LEVEL SECURITY;
```

`id` is the existing UUID string already generated in the app.  
`players` and `scores` are stored as JSONB — same shape as today's localStorage entries.

## Code Changes

### New files

**`src/lib/supabase.js`**  
Creates and exports the Supabase client using env vars.

**`src/hooks/useHistory.js`**  
Replaces `useLocalStorage('udisk_history', [])`. Responsibilities:
- On mount: fetch all rounds from Supabase, ordered by `created_at DESC`
- On mount (one-time migration): if `localStorage.udisk_history` has entries, insert them into Supabase then clear the key
- `saveRound(entry)`: insert a round into Supabase + update local state
- `deleteRound(id)`: delete by id from Supabase + update local state
- `deleteAllRounds()`: delete all rows from Supabase + clear local state
- Loading and error states exposed so UI can show feedback

### Modified files

**`src/pages/Summary.jsx`**  
Replace `useLocalStorage('udisk_history')` with `useHistory()`. Call `saveRound(entry)` instead of manually appending to the array.

**`src/pages/History.jsx`**  
Replace `useLocalStorage('udisk_history')` with `useHistory()`. Use `deleteRound` and `deleteAllRounds` from the hook.

**`src/pages/HistoryDetail.jsx`**  
Replace `useLocalStorage('udisk_history')` with `useHistory()`.

### Tests

History-related tests currently mock `useLocalStorage`. Update to mock `useHistory` instead with the same interface shape. No new test scenarios needed — the hook is the boundary.

## Migration

On first load of `useHistory`:
1. Check `localStorage.getItem('udisk_history')`
2. If non-empty array found: batch-insert all entries into Supabase
3. Remove `udisk_history` from localStorage
4. Continue with normal Supabase fetch

Migration runs once. If Supabase insert fails, localStorage data is preserved (not cleared) so no data is lost.

## Error Handling

- Network errors on fetch: show existing history from a local cache (React state from last successful fetch), display a subtle "Kunde inte ansluta" notice
- Insert failure on save: keep the round in a pending local state, retry is not automatic — user can see it saved locally but not synced
- This is acceptable complexity for v1 of a small friend-group app

## Setup Steps (for implementation)

1. Create Supabase project at supabase.com (free tier)
2. Run the SQL above in Supabase SQL editor
3. Copy Project URL and anon key
4. Add to Vercel env vars + local `.env.local`
5. Install `@supabase/supabase-js`
6. Implement code changes above
