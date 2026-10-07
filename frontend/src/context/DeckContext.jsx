import { createContext, useEffect, useState } from "react"
import { getDecks, createDeck } from "../services/decks"
import { getToken } from "../services/storage"

export const DeckContext = createContext()

function DeckProvider({ children }) {
    const [decks, setDecks] = useState([])
    const [currentDeck, setCurrentDeck] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDecks() {
            const token = getToken()

            if (!token) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError("")

            try {
                const data = await getDecks()

                if (data.length > 0) {
                    setDecks(data)
                    setCurrentDeck(data[0])
                } else {
                    const newDeck = await createDeck("Deck sans nom")

                    setDecks([newDeck])
                    setCurrentDeck(newDeck)
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDecks()
    }, [])

    return (
        <DeckContext.Provider
            value={{
                decks,
                setDecks,
                currentDeck,
                setCurrentDeck,
                loading,
                error
            }}
        >
            {children}
        </DeckContext.Provider>
    )
}

export default DeckProvider