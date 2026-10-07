import { useContext } from "react"
import { DeckContext } from "../../context/DeckContext"
import CardList from "../../components/CardList/CardList"
import "./DeckCards.scss"

function DeckCards() {
    const { currentDeck, loading, error } = useContext(DeckContext)

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

            <CardList cards={currentDeck.cards || []} />
        </section>
    )
}

export default DeckCards