import { getUser } from "../../services/storage"
import "./Dashboard.scss"

function Dashboard() {
    const user = getUser()

    return (
        <section className="dashboard">
            <h1>Tableau de bord</h1>

            {user ? (
                <>
                    <p>Bienvenue {user.username}</p>
                    <p>Email : {user.email}</p>
                </>
            ) : (
                <p>Utilisateur non connecté</p>
            )}
        </section>
    )
}

export default Dashboard