import Card from "../Card/Card"
import "./CardList.scss"

function CardList({ cards }) {
    return (
        <div className="card-list">
            {cards.map((card) => (
                <Card
                    key={card.id_cards}
                    card={card}
                />
            ))}
        </div>
    )
}

export default CardList