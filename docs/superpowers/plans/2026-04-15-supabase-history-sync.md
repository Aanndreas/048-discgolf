# Supabase History Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace localStorage-based history with a shared Supabase Postgres database so all devices in the friend group see the same round history.

**Architecture:** A new `useHistory` hook wraps all Supabase reads/writes and exposes `{ history, loading, saveRound, deleteRound, deleteAllRounds }`. Pages swap their `useLocalStorage('udisk_history')` call for `useHistory()`. On first mount the hook migrates any existing localStorage history to Supabase and clears the local key.

**Tech Stack:** `@supabase/supabase-js`, Supabase Postgres (free tier), Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

---

## Prerequisites (manual, done by user before coding starts)

- [ ] Create free Supabase project at supabase.com (region: eu-central-1)
- [ ] In Supabase SQL Editor, run:
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
```
- [ ] Copy Project URL and anon public key from Project Settings → API
- [ ] Create `udisk/.env.local` with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
- [ ] Add both vars to Vercel: `vercel env add VITE_SUPABASE_URL` and `vercel env add VITE_SUPABASE_ANON_KEY` (select all environments)

---

## Task 1: Install package and create Supabase client

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/lib/supabase.js`

- [ ] **Step 1: Install the package**

```bash
npm install @supabase/supabase-js
```

Expected: package added to `package.json` dependencies.

- [ ] **Step 2: Create the client file**

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

- [ ] **Step 3: Verify env vars are present locally**

```bash
cat .env.local
```

Expected: both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` present.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.js package.json package-lock.json
git commit -m ":wrench: add Supabase client"
```

---

## Task 2: Create useHistory hook

**Files:**
- Create: `src/hooks/useHistory.js`

- [ ] **Step 1: Create the hook**

Create `src/hooks/useHistory.js`:
```js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function rowToEntry(row) {
  return {
    id: row.id,
    courseId: row.course_id,
    courseName: row.course_name,
    date: row.date,
    players: row.players,
    scores: row.scores,
    winner: row.winner,
    holes: row.holes,
  }
}

function entryToRow(entry) {
  return {
    id: entry.id,
    course_id: entry.courseId ?? null,
    course_name: entry.courseName,
    date: entry.date,
    players: entry.players,
    scores: entry.scores,
    winner: entry.winner,
    holes: entry.holes ?? entry.players ? Object.values(entry.scores)[0]?.length ?? 18 : 18,
  }
}

export function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // One-time migration from localStorage
      try {
        const raw = localStorage.getItem('udisk_history')
        if (raw) {
          const entries = JSON.parse(raw)
          if (Array.isArray(entries) && entries.length > 0) {
            const rows = entries.map(entryToRow)
            await supabase.from('rounds').upsert(rows, { onConflict: 'id' })
            localStorage.removeItem('udisk_history')
          }
        }
      } catch {}

      // Fetch all rounds
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setHistory(data.map(rowToEntry))
      }
      setLoading(false)
    }

    init()
  }, [])

  async function saveRound(entry) {
    const row = entryToRow(entry)
    const { error } = await supabase.from('rounds').insert(row)
    if (!error) {
      setHistory(prev => [entry, ...prev])
    }
  }

  async function deleteRound(id) {
    const { error } = await supabase.from('rounds').delete().eq('id', id)
    if (!error) {
      setHistory(prev => prev.filter(e => e.id !== id))
    }
  }

  async function deleteAllRounds() {
    const { error } = await supabase.from('rounds').delete().neq('id', '')
    if (!error) {
      setHistory([])
    }
  }

  return { history, loading, saveRound, deleteRound, deleteAllRounds }
}
```

- [ ] **Step 2: Run existing tests to confirm nothing broken yet**

```bash
npm test -- --run
```

Expected: 38 tests pass (hook not used anywhere yet).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHistory.js
git commit -m ":sparkles: add useHistory hook backed by Supabase"
```

---

## Task 3: Update History page

**Files:**
- Modify: `src/pages/History.jsx`
- Modify: `src/__tests__/History.test.jsx`

- [ ] **Step 1: Update the tests to mock useHistory**

Replace the full content of `src/__tests__/History.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import History from '../pages/History'

const mockDelete = vi.fn()
const mockDeleteAll = vi.fn()

const mockHistory = [
  { id: '1', courseName: 'Hemus', date: '2026-04-14', winner: 'Anton', players: ['Anton', 'Ludde'], scores: {} },
  { id: '2', courseName: 'Orsa', date: '2026-04-13', winner: 'Ludde', players: ['Anton', 'Ludde'], scores: {} },
]

vi.mock('../hooks/useHistory', () => ({
  useHistory: () => ({
    history: mockHistory,
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  }),
}))

function renderHistory() {
  return render(<MemoryRouter><History /></MemoryRouter>)
}

test('shows saved rounds', () => {
  renderHistory()
  expect(screen.getByText('Hemus')).toBeInTheDocument()
  expect(screen.getByText('Orsa')).toBeInTheDocument()
})

test('can delete a single round', () => {
  renderHistory()
  const deleteButtons = screen.getAllByText('Ta bort')
  fireEvent.click(deleteButtons[0])
  expect(mockDelete).toHaveBeenCalledWith('1')
})

test('can clear all history', () => {
  renderHistory()
  fireEvent.click(screen.getByText('Rensa all historik'))
  expect(mockDeleteAll).toHaveBeenCalled()
})

test('shows empty message when no history', () => {
  vi.mocked(vi.importMock('../hooks/useHistory')).useHistory = () => ({
    history: [],
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  })
})
```

Wait — the simpler mock pattern for vitest is to use `vi.mock` at module level and override per test with `mockReturnValue`. Rewrite as:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, beforeEach } from 'vitest'
import History from '../pages/History'

const mockDelete = vi.fn()
const mockDeleteAll = vi.fn()

vi.mock('../hooks/useHistory', () => ({
  useHistory: vi.fn(),
}))

import { useHistory } from '../hooks/useHistory'

const mockHistoryData = [
  { id: '1', courseName: 'Hemus', date: '2026-04-14', winner: 'Anton', players: ['Anton', 'Ludde'], scores: {} },
  { id: '2', courseName: 'Orsa', date: '2026-04-13', winner: 'Ludde', players: ['Anton', 'Ludde'], scores: {} },
]

beforeEach(() => {
  vi.mocked(useHistory).mockReturnValue({
    history: mockHistoryData,
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  })
})

function renderHistory() {
  return render(<MemoryRouter><History /></MemoryRouter>)
}

test('shows saved rounds', () => {
  renderHistory()
  expect(screen.getByText('Hemus')).toBeInTheDocument()
  expect(screen.getByText('Orsa')).toBeInTheDocument()
})

test('can delete a single round', () => {
  renderHistory()
  fireEvent.click(screen.getAllByText('Ta bort')[0])
  expect(mockDelete).toHaveBeenCalledWith('1')
})

test('can clear all history', () => {
  renderHistory()
  fireEvent.click(screen.getByText('Rensa all historik'))
  expect(mockDeleteAll).toHaveBeenCalled()
})

test('shows empty message when no history', () => {
  vi.mocked(useHistory).mockReturnValue({
    history: [],
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  })
  renderHistory()
  expect(screen.getByText(/inga sparade rundor/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests — expect History tests to fail**

```bash
npm test -- --run src/__tests__/History.test.jsx
```

Expected: History tests fail because the page still uses `useLocalStorage`.

- [ ] **Step 3: Update History.jsx**

Replace `src/pages/History.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import { HistoryList } from '../components/HistoryList'

export default function History() {
  const navigate = useNavigate()
  const { history, loading, deleteRound, deleteAllRounds } = useHistory()

  function handleDelete(id) {
    deleteRound(id)
  }

  function handleDeleteAll() {
    deleteAllRounds()
  }

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Historik</h1>
        <button className="btn-ghost" onClick={() => navigate('/')}>← Hem</button>
      </div>
      {loading ? (
        <p style={{ color: 'var(--text-2)', textAlign: 'center', paddingTop: 32 }}>Laddar...</p>
      ) : (
        <HistoryList
          history={history}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — all should pass**

```bash
npm test -- --run
```

Expected: all 38 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/History.jsx src/__tests__/History.test.jsx
git commit -m ":zap: migrate History page to useHistory hook"
```

---

## Task 4: Update HistoryDetail page

**Files:**
- Modify: `src/pages/HistoryDetail.jsx`

- [ ] **Step 1: Replace useLocalStorage with useHistory in HistoryDetail.jsx**

Change the import and hook call at the top of the file. Find:
```js
import { useLocalStorage } from '../hooks/useLocalStorage'
```
Replace with:
```js
import { useHistory } from '../hooks/useHistory'
```

Find:
```js
const [history] = useLocalStorage('udisk_history', [])
```
Replace with:
```js
const { history } = useHistory()
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: all 38 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/HistoryDetail.jsx
git commit -m ":zap: migrate HistoryDetail page to useHistory hook"
```

---

## Task 5: Update Summary page

**Files:**
- Modify: `src/pages/Summary.jsx`

- [ ] **Step 1: Replace useLocalStorage with useHistory in Summary.jsx**

Change the import:
```js
import { useLocalStorage } from '../hooks/useLocalStorage'
```
→
```js
import { useHistory } from '../hooks/useHistory'
```

Change the hook call (line ~20):
```js
const [history, setHistory] = useLocalStorage('udisk_history', [])
```
→
```js
const { saveRound } = useHistory()
```

Change how the round is saved inside `useEffect` (find `setHistory(prev => [entry, ...prev])`):
```js
setHistory(prev => [entry, ...prev])
```
→
```js
saveRound(entry)
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: all 38 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Summary.jsx
git commit -m ":zap: migrate Summary page to useHistory hook"
```

---

## Task 6: Add Vercel env vars and deploy

**Files:** none (Vercel config only)

- [ ] **Step 1: Add env vars to Vercel for all environments**

```bash
vercel env add VITE_SUPABASE_URL
```
When prompted: paste the Project URL, select Production + Preview + Development.

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```
When prompted: paste the anon key, select Production + Preview + Development.

- [ ] **Step 2: Push to trigger deploy**

```bash
git push
```

Expected: Vercel auto-deploys, picks up the new env vars.

- [ ] **Step 3: Smoke test on live URL**

Open https://udisk.vercel.app/history — history should load from Supabase.
Play a quick test round and finish it — check that the round appears in Supabase Table Editor.

---

## Task 7: Verify migration works end-to-end

This task is manual verification only.

- [ ] If there is existing history in localStorage on a device, open the app — the hook should migrate it automatically on first load and the rounds should appear in Supabase.
- [ ] Open Supabase Table Editor → `rounds` table → confirm rows exist.
- [ ] Open the app on a second device/browser — confirm same history appears.
- [ ] Delete a round on one device, refresh on the other — confirm it's gone.
