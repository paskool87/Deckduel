import { getToken } from "./storage"

const API_URL = import.meta.env.VITE_API_URL

export async function addTrait(deckId, traitId, intensity) {
    const token = getToken()

    const response = await fetch(
        `${API_URL}/api/decks/${deckId}/traits`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                trait_id:traitId,
                intensity
            })
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || "Erreur lors de l'ajout du trait"
        )
    }

    return data
}

export async function updateTrait(
    deckId,
    traitId,
    intensity
) {
    const token = getToken()

    const response = await fetch(
        `${API_URL}/api/decks/${deckId}/traits/${traitId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                intensity
            })
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || "Erreur lors de la modification du trait"
        )
    }

    return data
}

export async function deleteTrait(deckId, traitId) {
    const token = getToken()

    const response = await fetch(
        `${API_URL}/api/decks/${deckId}/traits/${traitId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    if (!response.ok) {
        const data = await response.json()

        throw new Error(
            data.error || "Erreur lors de la suppression du trait"
        )
    }
}

export async function getTraits() {
    const response = await fetch(`${API_URL}/api/traits`)

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error || "Erreur lors de la récupération des traits"
        )
    }

    return data
}