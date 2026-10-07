import { useEffect, useState } from "react"
import { getDecks } from "../../services/decks"
import "./Dashboard.scss"

function Dashboard() {
    const [decks, setDecks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDecks() {
            try {
                const data = await getDecks()

                setDecks(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDecks()
    }, [])

    return (
        <section className="dashboard">
            <h1>Tableau de bord</h1>

            {loading && <p>Chargement...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
                <>
                    {decks.length === 0 ? (
                        <p>Vous n'avez pas encore de deck.</p>
                    ) : (
                        <>
                            <h2>Mes decks</h2>

                            {decks.map((deck) => (
                                <div key={deck.id_decks}>
                                    <p>{deck.name}</p>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </section>
    )
}

export default Dashboard