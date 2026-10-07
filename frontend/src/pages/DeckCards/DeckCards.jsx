import { useContext } from "react"
import { DeckContext } from "../../context/DeckContext"
import CardList from "../../components/CardList/CardList"
import "./DeckCards.scss"

function DeckCards() {
    const { deck } = useContext(DeckContext)

    return (
        <section className="deck-cards">
            <h1>Mes cartes</h1>

            <CardList cards={deck.cards} />
        </section>
    )
}

export default DeckCards