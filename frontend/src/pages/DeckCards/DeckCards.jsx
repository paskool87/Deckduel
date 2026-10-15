import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDeckById } from "../../services/decks"
import CardList from "../../components/CardList/CardList"
import "./DeckCards.scss"

function DeckCards() {
    const { deckId } = useParams()

    const [currentDeck, setCurrentDeck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDeck() {
            try {
                setLoading(true)
                setError("")

                const deck = await getDeckById(deckId)

                setCurrentDeck(deck)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDeck()
    }, [deckId])

    if (loading) {
        return (
            <section className="deck-cards">
                <p>Chargement du deck...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="deck-cards">
                <p>{error}</p>
            </section>
        )
    }

    if (!currentDeck) {
        return (
            <section className="deck-cards">
                <p>Aucun deck disponible.</p>
            </section>
        )
    }

    const cards = currentDeck.cards || []

    const assignedAbilities = cards.filter(function (card) {
        return card.special_ability_id !== null &&
            card.special_ability_id !== undefined &&
            card.special_ability_id !== ""
    }).length

    const remainingAbilities = Math.max(0, 5 - assignedAbilities)

    const influences =
        currentDeck.influences ||
        currentDeck.traits ||
        currentDeck.deckTraits ||
        currentDeck.deck_traits

    const hasInfluencesData = Array.isArray(influences)

    const influenceCount = hasInfluencesData
        ? influences.length
        : null

    const cardsComplete = cards.length === 20
    const abilitiesComplete = assignedAbilities === 5
    const influencesComplete =
        hasInfluencesData && influenceCount === 3

    const deckPlayable =
        cardsComplete &&
        abilitiesComplete &&
        influencesComplete

    return (
        <section className="deck-cards">
            <h1>Mon deck</h1>

            <div className="deck-cards__summary">
                <h2>État du deck</h2>

                <div className="deck-cards__summary-item">
                    <span>Cartes</span>

                    <strong>
                        {cards.length} / 20
                    </strong>

                    <span>
                        {cardsComplete
                            ? "Complet"
                            : `Il manque ${20 - cards.length} carte(s)`}
                    </span>
                </div>

                <div className="deck-cards__summary-item">
                    <span>Capacités spéciales attribuées</span>

                    <strong>
                        {assignedAbilities} / 5
                    </strong>

                    <span>
                        {remainingAbilities > 0
                            ? `${remainingAbilities} capacité(s) à attribuer`
                            : assignedAbilities === 5
                                ? "Toutes les capacités sont attribuées"
                                : "Le nombre de capacités attribuées dépasse la limite"}
                    </span>
                </div>

                <div className="deck-cards__summary-item">
                    <span>Influences</span>

                    <strong>
                        {hasInfluencesData
                            ? `${influenceCount} / 3`
                            : "Non vérifiées"}
                    </strong>

                    <span>
                        {hasInfluencesData
                            ? influencesComplete
                                ? "Nombre d'influences correct"
                                : `Il faut exactement 3 influences`
                            : "Les influences ne sont pas présentes dans les données chargées"}
                    </span>
                </div>

                <div
                    className={`deck-cards__status ${
                        deckPlayable
                            ? "deck-cards__status--playable"
                            : "deck-cards__status--incomplete"
                    }`}
                >
                    <strong>
                        {deckPlayable
                            ? "Deck complet"
                            : "Deck incomplet"}
                    </strong>

                    <p>
                        {deckPlayable
                            ? "Les conditions de quantité sont remplies."
                            : "Le deck ne peut pas encore être déclaré jouable."}
                    </p>
                </div>
            </div>

            <h2>Mes cartes</h2>

            <CardList
                cards={cards}
                deckId={deckId}
            />
        </section>
    )
}

export default DeckCards