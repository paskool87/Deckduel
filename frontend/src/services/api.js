const API_URL = import.meta.env.VITE_API_URL

export async function getHealth() {
  const response = await fetch(`${API_URL}/api/health`)

  if (!response.ok) {
    throw new Error('Erreur lors de la connexion à l API')
  }

  return response.json()
}