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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {players.map(name => (
        <div key={name} className="card row" style={{ justifyContent: 'space-between' }}>
          <span>{name}</span>
          <div className="row">
            <button
              className="btn-ghost"
              style={{ padding: '4px 10px' }}
              onClick={() => onToggleFavorite(name)}
              title={favorites.includes(name) ? 'Ta bort från favoriter' : 'Spara som favorit'}
            >
              {favorites.includes(name) ? '★' : '☆'}
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '4px 10px', color: 'var(--highlight)' }}
              onClick={() => onRemove(name)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {suggestions.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 6 }}>
            Favoriter
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
          style={{ flex: 1 }}
        />
        <button onClick={handleAdd} style={{ flexShrink: 0 }}>Lägg till</button>
      </div>
    </div>
  )
}
