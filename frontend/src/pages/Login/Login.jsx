import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../services/auth"
import { setToken, setUser } from "../../services/storage"
import "./Login.scss"

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        setError("")
        setLoading(true)

        try {
            const data = await login(email, password)

            setToken(data.token)
            setUser(data.user)

            navigate("/dashboard")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="login">
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Mot de passe
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p className="login__error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>

            <p className="login__register">
                Pas encore de compte ?{" "}
                <Link to="/register">
                    Créer un compte
                </Link>
            </p>
        </section>
    )
}

export default Login