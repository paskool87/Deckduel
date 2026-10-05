import { useEffect, useState } from 'react'
import { getHealth } from './services/api'

function App() {
  const [status, setStatus] = useState('Connexion...')

  useEffect(() => {
    getHealth()
      .then((data) => {
        setStatus(data.status)
      })
      .catch(() => {
        setStatus('Erreur de connexion')
      })
  }, [])

  return (
    <main>
      <h1>DeckDuel</h1>
      <p>API : {status}</p>
    </main>
  )
}

export default App