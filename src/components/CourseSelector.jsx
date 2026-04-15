import { useState } from 'react'

export function CourseSelector({ courses, onSelect, onAddCourse }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customHoles, setCustomHoles] = useState(18)

  function handleAdd() {
    if (!customName.trim()) return
    const newCourse = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      holes: Number(customHoles),
      custom: true,
    }
    onAddCourse(newCourse)
    onSelect(newCourse)
    setShowCustom(false)
    setCustomName('')
    setCustomHoles(18)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {courses.map(course => (
        <button
          key={course.id}
          className="btn-ghost"
          style={{ textAlign: 'left', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
          onClick={() => onSelect(course)}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>
            {course.name}
          </span>
          <span style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: '0.875rem', flexShrink: 0 }}>
            {course.holes} hål
          </span>
        </button>
      ))}

      {!showCustom ? (
        <button className="btn-ghost" onClick={() => setShowCustom(true)}>
          + Lägg till bana
        </button>
      ) : (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="Banans namn"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            autoFocus
          />
          <input
            type="number"
            min={1}
            max={36}
            value={customHoles}
            onChange={e => setCustomHoles(e.target.value)}
            placeholder="Antal hål"
          />
          <div className="row">
            <button className="btn-primary" onClick={handleAdd} style={{ flex: 1 }}>
              Spara och välj
            </button>
            <button className="btn-ghost" onClick={() => setShowCustom(false)}>
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
