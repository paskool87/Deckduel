import { Link } from "react-router-dom"
import "./Home.scss"

function Home() {
    return (
        <section className="home">
            <h1>DeckDuel</h1>

            <p>
                Crée ton deck, personnalise tes cartes
                et affronte tes adversaires.
            </p>

            <div className="home__actions">
                <Link to="/login">Se connecter</Link>
                <Link to="/register">Créer un compte</Link>
            </div>
        </section>
    )
}

export default Home