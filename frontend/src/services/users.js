const API_URL = import.meta.env.VITE_API_URL

export async function register(username, email, password) {
    const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription")
    }

    return data
}