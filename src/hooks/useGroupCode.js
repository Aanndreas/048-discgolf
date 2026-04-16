import { useState } from 'react'

const KEY = 'udisk_group'

export function useGroupCode() {
  const [code, setCode] = useState(() => localStorage.getItem(KEY) ?? '')

  function saveCode(c) {
    const clean = c.trim().toUpperCase().slice(0, 3)
    localStorage.setItem(KEY, clean)
    setCode(clean)
  }

  return { code, saveCode, isSet: code.length > 0 }
}
