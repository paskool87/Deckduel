import { Link } from "react-router-dom"
import "./CardList.scss"

function CardList({ cards }) {
    return (
        <div className="card-list">
            {cards.map((card) => (
                <Link
                    key={card.id}
                    to={`/card/${card.id}`}
                    className="card-list__card"
                >
                    <span>Carte {card.id}</span>
                </Link>
            ))}
        </div>
    )
}

export default CardList