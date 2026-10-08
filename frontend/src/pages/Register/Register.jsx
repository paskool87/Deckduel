import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../../services/users"
import "./Register.scss"

function Register() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        setError("")

        if (password !== passwordConfirmation) {
            setError(
                "Les mots de passe ne correspondent pas."
            )
            return
        }

        setLoading(true)

        try {
            await register(
                username,
                email,
                password
            )

            navigate("/login")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="register">
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">
                        Nom d'utilisateur
                    </label>

                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="email">
                        Email
                    </label>

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

                <div>
                    <label htmlFor="passwordConfirmation">
                        Confirmation du mot de passe
                    </label>

                    <input
                        type="password"
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(event) =>
                            setPasswordConfirmation(
                                event.target.value
                            )
                        }
                        required
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p className="register__error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Création du compte..."
                        : "Créer mon compte"}
                </button>
            </form>

            <p className="register__login">
                Déjà un compte ?{" "}
                <Link to="/login">
                    Se connecter
                </Link>
            </p>
        </section>
    )
}

export default Register