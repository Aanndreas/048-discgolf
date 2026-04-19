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
    <div className="col">
      {courses.map(course => (
        <button
          key={course.id}
          className="btn-ghost course-btn"
          onClick={() => onSelect(course)}
        >
          <span className="course-name-display">
            {course.name}
          </span>
          <span className="course-holes-count">
            {course.holes} hål
          </span>
        </button>
      ))}

      {!showCustom ? (
        <button className="btn-ghost" onClick={() => setShowCustom(true)}>
          + Lägg till bana
        </button>
      ) : (
        <div className="card col">
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
            <button className="btn-primary flex-1" onClick={handleAdd}>
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
