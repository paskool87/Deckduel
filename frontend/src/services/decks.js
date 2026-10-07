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
            data.error || "Erreur lors de la récupération des decks"
        )
    }

    return data
}

export async function createDeck(name) {
    const token = getToken()

    const response = await fetch(`${API_URL}/api/decks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || "Erreur lors de la création du deck"
        )
    }

    return data
}

export async function getDeckById(deckId) {
    const token = getToken()

    const response = await fetch(`${API_URL}/api/decks/${deckId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || "Erreur lors de la récupération du deck"
        )
    }

    return data
}