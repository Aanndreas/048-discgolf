import { useNavigate } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import { HistoryList } from '../components/HistoryList'
import { PageCredit } from '../components/PageCredit'

export default function History() {
  const navigate = useNavigate()
  const { history, loading, deleteRound, deleteAllRounds } = useHistory()

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Historik</h1>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn-ghost" onClick={() => navigate('/stats')}>Statistik</button>
          <button className="btn-ghost" onClick={() => navigate('/')}>← Hem</button>
        </div>
      </div>
      {loading ? (
        <p style={{ color: 'var(--text-2)', textAlign: 'center', paddingTop: 32 }}>Laddar...</p>
      ) : (
        <HistoryList
          history={history}
          onDelete={deleteRound}
          onDeleteAll={deleteAllRounds}
        />
      )}
      <PageCredit />
    </div>
  )
}
