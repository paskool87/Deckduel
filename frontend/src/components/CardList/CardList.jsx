import { Link } from "react-router-dom"
import Card from "../Card/Card"
import "./CardList.scss"

function CardList({ cards, deckId }) {
    return (
        <div className="card-list">
            {cards.map((card, index) => (
                <Link
                    className="card-list__link"
                    key={card.id_cards}
                    to={`/decks/${deckId}/cards/${card.id_cards}`}
                >
                    <Card
                        card={card}
                        number={index + 1}
                    />
                </Link>
            ))}
        </div>
    )
}

export default CardList