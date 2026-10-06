import { getToken } from "./storage"

const API_URL = import.meta.env.VITE_API_URL

export async function getDecks() {
    const token = getToken()

    const response = await fetch(`${API_URL}/api/decks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la récupération des decks"
        )
    }

    return data
}