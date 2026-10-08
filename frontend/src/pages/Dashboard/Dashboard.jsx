import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getDecks, getDeckById } from "../../services/decks"
import "./Dashboard.scss"

function Dashboard() {
    const [decks, setDecks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDecks() {
            try {
                const data = await getDecks()

                const completeDecks = await Promise.all(
                    data.map((deck) =>
                        getDeckById(deck.id_decks)
                    )
                )

                setDecks(completeDecks)
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
                    <h2>Mes decks</h2>

                    {decks.length === 0 ? (
                        <p>Vous n'avez pas encore de deck.</p>
                    ) : (
                        <div className="dashboard__decks">
                            {decks.map((deck) => {
                                const traitCount =
                                    deck.traits?.length || 0

                                const abilityIds =
                                    deck.cards
                                        ?.map(
                                            (card) =>
                                                card.special_ability_id
                                        )
                                        .filter(
                                            (abilityId) =>
                                                abilityId !== null &&
                                                abilityId !== undefined
                                        ) || []

                                const abilityCount =
                                    new Set(abilityIds).size

                                const hasEnoughTraits =
                                    traitCount === 3

                                const hasEnoughAbilities =
                                    abilityCount === 5

                                const deckReady =
                                    hasEnoughTraits &&
                                    hasEnoughAbilities

                                return (
                                    <article
                                        className="dashboard__deck"
                                        key={deck.id_decks}
                                    >
                                        <h3>{deck.name}</h3>

                                        <div className="dashboard__actions">
                                            <Link
                                                to={`/decks/${deck.id_decks}/cards`}
                                            >
                                                Mes cartes
                                            </Link>

                                            <Link
                                                to={`/decks/${deck.id_decks}/traits`}
                                            >
                                                Mes traits
                                            </Link>
                                        </div>

                                        {!deckReady && (
                                            <div className="dashboard__missing">
                                                {!hasEnoughTraits && (
                                                    <p>
                                                        Traits non choisis
                                                    </p>
                                                )}

                                                {!hasEnoughAbilities && (
                                                    <p>
                                                        Capacités non choisies
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {deckReady && (
                                            <Link
                                                className="dashboard__duel"
                                                to="/duel"
                                            >
                                                Lancer un duel avec ce deck
                                            </Link>
                                        )}
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default Dashboard