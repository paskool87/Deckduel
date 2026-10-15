import { getToken } from "./storage"

const API_URL = import.meta.env.VITE_API_URL

export async function updateCard(deckId, cardId, cardData) {
    const token = getToken()

    const response = await fetch(
        `${API_URL}/api/decks/${deckId}/cards/${cardId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cardData)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Erreur lors de la modification de la carte"
        )
    }

    return data
}