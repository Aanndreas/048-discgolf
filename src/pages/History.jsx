import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { HistoryList } from '../components/HistoryList'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useLocalStorage('udisk_history', [])

  function handleDelete(id) {
    setHistory(prev => prev.filter(e => e.id !== id))
  }

  function handleDeleteAll() {
    setHistory([])
  }

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Historik</h1>
        <button className="btn-ghost" onClick={() => navigate('/')}>← Hem</button>
      </div>
      <HistoryList
        history={history}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  )
}
