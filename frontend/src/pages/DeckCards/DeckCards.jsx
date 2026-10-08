import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDeckById } from "../../services/decks"
import CardList from "../../components/CardList/CardList"
import "./DeckCards.scss"

function DeckCards() {
    const { deckId } = useParams()

    const [currentDeck, setCurrentDeck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDeck() {
            try {
                setLoading(true)
                setError("")

                const deck = await getDeckById(deckId)

                setCurrentDeck(deck)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDeck()
    }, [deckId])

    if (loading) {
        return (
            <section className="deck-cards">
                <p>Chargement du deck...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="deck-cards">
                <p>{error}</p>
            </section>
        )
    }

    if (!currentDeck) {
        return (
            <section className="deck-cards">
                <p>Aucun deck disponible.</p>
            </section>
        )
    }

    return (
        <section className="deck-cards">
            <h1>Mes cartes</h1>

            <CardList
                cards={currentDeck.cards || []}
                deckId={deckId}
            />
        </section>
    )
}

export default DeckCards