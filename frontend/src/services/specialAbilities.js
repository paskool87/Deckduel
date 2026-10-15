const API_URL = import.meta.env.VITE_API_URL

export async function getSpecialAbilities() {
    const response = await fetch(
        `${API_URL}/api/special-abilities`
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Erreur lors de la récupération des capacités spéciales"
        )
    }

    if (Array.isArray(data)) {
        return data
    }

    return (
        data.specialAbilities ||
        data.special_abilities ||
        data.data ||
        []
    )
}