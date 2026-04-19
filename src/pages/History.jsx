import { useHistory } from '../hooks/useHistory'
import { HistoryList } from '../components/HistoryList'
import { PageCredit } from '../components/PageCredit'

export default function History() {
  const { history, loading, deleteRound, deleteAllRounds } = useHistory()

  return (
    <div className="page">
      <h1>Historik</h1>
      {loading ? (
        <p className="empty-state">Laddar...</p>
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
