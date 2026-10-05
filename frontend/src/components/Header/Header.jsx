import { Link } from "react-router-dom"
import "./Header.scss"

function Header() {
    return (
        <header className="header">
            <Link to="/" className="header__logo">
                DeckDuel
            </Link>

            <nav className="header__nav">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/deck">Mon deck</Link>
                <Link to="/duel">Duel</Link>
                <Link to="/profile">Profil</Link>
            </nav>
        </header>
    )
}

export default Header