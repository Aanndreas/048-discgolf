import { useState } from 'react'

export function PlayerSelector({ players, favorites, onAdd, onRemove, onToggleFavorite }) {
  const [input, setInput] = useState('')

  function handleAdd() {
    const name = input.trim()
    if (!name || players.includes(name)) return
    onAdd(name)
    setInput('')
  }

  const suggestions = favorites.filter(f => !players.includes(f))

  return (
    <div className="col">
      {players.map(name => (
        <div key={name} className="card row row-between">
          <span>{name}</span>
          <div className="row">
            <button
              className="btn-ghost btn-sm"
              onClick={() => onToggleFavorite(name)}
              title={favorites.includes(name) ? 'Ta bort från favoriter' : 'Spara som favorit'}
            >
              {favorites.includes(name) ? '★' : '☆'}
            </button>
            <button
              className="btn-ghost btn-sm"
              style={{ color: 'var(--highlight)' }}
              onClick={() => onRemove(name)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {suggestions.length > 0 && (
        <div>
          <p className="favorites-label">Favoriter</p>
          <div className="favorites-list">
            {suggestions.map(name => (
              <button key={name} className="btn-ghost" onClick={() => onAdd(name)}>
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="row">
        <input
          placeholder="Lägg till spelare"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <button onClick={handleAdd} className="flex-shrink-0">Lägg till</button>
      </div>
    </div>
  )
}
