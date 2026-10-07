import { useContext } from "react"
import { DeckContext } from "../../context/DeckContext"
import "./Deck.scss"

function Deck() {
    const {
        currentDeck,
        loading,
        error
    } = useContext(DeckContext)

    if (loading) {
        return (
            <section className="deck">
                <p>Chargement du deck...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="deck">
                <p>{error}</p>
            </section>
        )
    }

    if (!currentDeck) {
        return (
            <section className="deck">
                <p>Aucun deck disponible.</p>
            </section>
        )
    }

    return (
        <section className="deck">
            <h1>{currentDeck.name}</h1>

            <p>ID du deck : {currentDeck.id_decks}</p>
        </section>
    )
}

export default Deck