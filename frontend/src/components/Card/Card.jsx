import { useParams } from "react-router-dom"
import "./Card.scss"

function Card() {
    const { cardId } = useParams()

    return (
        <section className="card">
            <h1>Carte {cardId}</h1>
        </section>
    )
}

export default Card