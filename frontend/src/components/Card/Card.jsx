import "./Card.scss"

function Card({ card, number }) {
    return (
        <article className="card">
            <h2>Carte {number}</h2>

            <div className="card__stats">
                <p>
                    <span>Vie</span>
                    <strong>{card.health}</strong>
                </p>

                <p>
                    <span>Attaque</span>
                    <strong>{card.attack}</strong>
                </p>

                <p>
                    <span>Défense</span>
                    <strong>{card.defense}</strong>
                </p>
            </div>

            <div className="card__ability">
                <span>Capacité</span>

                <strong>
                    {card.special_ability_id
                        ? `Capacité ${card.special_ability_id}`
                        : "Aucune"}
                </strong>
            </div>
        </article>
    )
}

export default Card