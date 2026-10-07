import { useContext, useEffect, useState } from "react"
import { DeckContext } from "../../context/DeckContext"
import {
    getTraits,
    addTrait,
    updateTrait,
    deleteTrait
} from "../../services/traits"
import "./DeckTraits.scss"

function DeckTraits() {
    const {
        currentDeck,
        refreshDeck,
        loading,
        error
    } = useContext(DeckContext)

    const [traits, setTraits] = useState([])
    const [traitsLoading, setTraitsLoading] = useState(true)
    const [traitsError, setTraitsError] = useState("")

    const [selectedTraits, setSelectedTraits] = useState([])
    const [saving, setSaving] = useState(false)
    const [actionError, setActionError] = useState("")

    useEffect(() => {
        async function loadTraits() {
            try {
                const data = await getTraits()
                setTraits(data)
            } catch (error) {
                setTraitsError(error.message)
            } finally {
                setTraitsLoading(false)
            }
        }

        loadTraits()
    }, [])

    useEffect(() => {
        async function loadCurrentDeck() {
            if (!currentDeck) {
                return
            }

            try {
                const deck = await refreshDeck(currentDeck.id_decks)

                setSelectedTraits(
                    (deck.traits || []).map((trait) => ({
                        trait_id: trait.trait_id,
                        name: trait.name,
                        description: trait.description,
                        intensity: trait.intensity
                    }))
                )
            } catch (error) {
                setActionError(error.message)
            }
        }

        loadCurrentDeck()
    }, [currentDeck?.id_decks])

    const totalIntensity = selectedTraits.reduce(
        (total, trait) => total + trait.intensity,
        0
    )

    const maxTraitsReached = selectedTraits.length >= 3
    const maxIntensityReached = totalIntensity >= 9

    const canValidate =
        selectedTraits.length === 3 &&
        totalIntensity === 9

    function handleSelectTrait(trait) {
        if (maxTraitsReached || maxIntensityReached) {
            return
        }

        const alreadySelected = selectedTraits.some(
            (item) => item.trait_id === trait.id_traits
        )

        if (alreadySelected) {
            return
        }

        setActionError("")

        setSelectedTraits((currentTraits) => [
            ...currentTraits,
            {
                trait_id: trait.id_traits,
                name: trait.name,
                description: trait.description,
                intensity: 1
            }
        ])
    }

    function handleIncrease(traitId) {
        setSelectedTraits((currentTraits) => {
            const currentTotal = currentTraits.reduce(
                (total, trait) => total + trait.intensity,
                0
            )

            if (currentTotal >= 9) {
                return currentTraits
            }

            return currentTraits.map((trait) => {
                if (trait.trait_id !== traitId) {
                    return trait
                }

                if (trait.intensity >= 7) {
                    return trait
                }

                return {
                    ...trait,
                    intensity: trait.intensity + 1
                }
            })
        })
    }

    function handleDecrease(traitId) {
        setSelectedTraits((currentTraits) =>
            currentTraits.map((trait) => {
                if (trait.trait_id !== traitId) {
                    return trait
                }

                if (trait.intensity <= 1) {
                    return trait
                }

                return {
                    ...trait,
                    intensity: trait.intensity - 1
                }
            })
        )
    }

    function handleDelete(traitId) {
        setSelectedTraits((currentTraits) =>
            currentTraits.filter(
                (trait) => trait.trait_id !== traitId
            )
        )

        setActionError("")
    }

    async function handleSave() {
        if (!currentDeck) {
            return
        }

        if (selectedTraits.length !== 3) {
            setActionError(
                "Vous devez sélectionner exactement 3 traits."
            )
            return
        }

        if (totalIntensity !== 9) {
            setActionError(
                "Vous devez utiliser exactement 9 points d'intensité."
            )
            return
        }

        const invalidIntensity = selectedTraits.some(
            (trait) =>
                trait.intensity < 1 ||
                trait.intensity > 7
        )

        if (invalidIntensity) {
            setActionError(
                "Chaque intensité doit être comprise entre 1 et 7."
            )
            return
        }

        setSaving(true)
        setActionError("")

        try {
            const existingTraits = currentDeck.traits || []

            for (const existingTrait of existingTraits) {
                const selectedTrait = selectedTraits.find(
                    (trait) =>
                        trait.trait_id === existingTrait.trait_id
                )

                if (!selectedTrait) {
                    await deleteTrait(
                        currentDeck.id_decks,
                        existingTrait.trait_id
                    )
                }
            }

            for (const selectedTrait of selectedTraits) {
                const existingTrait = existingTraits.find(
                    (trait) =>
                        trait.trait_id === selectedTrait.trait_id
                )

                if (!existingTrait) {
                    await addTrait(
                        currentDeck.id_decks,
                        selectedTrait.trait_id,
                        selectedTrait.intensity
                    )
                } else if (
                    existingTrait.intensity !== selectedTrait.intensity
                ) {
                    await updateTrait(
                        currentDeck.id_decks,
                        selectedTrait.trait_id,
                        selectedTrait.intensity
                    )
                }
            }

            const updatedDeck = await refreshDeck(
                currentDeck.id_decks
            )

            setSelectedTraits(
                (updatedDeck.traits || []).map((trait) => ({
                    trait_id: trait.trait_id,
                    name: trait.name,
                    description: trait.description,
                    intensity: trait.intensity
                }))
            )
        } catch (error) {
            setActionError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading || traitsLoading) {
        return (
            <section className="deck-traits">
                <p>Chargement des traits...</p>
            </section>
        )
    }

    if (error || traitsError) {
        return (
            <section className="deck-traits">
                <p>{error || traitsError}</p>
            </section>
        )
    }

    if (!currentDeck) {
        return (
            <section className="deck-traits">
                <p>Aucun deck disponible.</p>
            </section>
        )
    }

    return (
        <section className="deck-traits">
            <h1>Traits de {currentDeck.name}</h1>

            <div className="deck-traits__summary">
                <p>
                    Traits : {selectedTraits.length} / 3
                </p>

                <p>
                    Intensité : {totalIntensity} / 9
                </p>
            </div>

            <h2>Traits disponibles</h2>

            <div className="deck-traits__list">
                {traits.map((trait) => {
                    const selected = selectedTraits.some(
                        (item) =>
                            item.trait_id === trait.id_traits
                    )

                    return (
                        <article
                            className="deck-traits__item"
                            key={trait.id_traits}
                        >
                            <h3>{trait.name}</h3>

                            <p>{trait.description}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    handleSelectTrait(trait)
                                }
                                disabled={
                                    selected ||
                                    maxTraitsReached ||
                                    maxIntensityReached
                                }
                            >
                                {selected
                                    ? "Sélectionné"
                                    : "Sélectionner"}
                            </button>
                        </article>
                    )
                })}
            </div>

            <h2>Traits sélectionnés</h2>

            <div className="deck-traits__selected">
                {selectedTraits.length === 0 ? (
                    <p>Aucun trait sélectionné.</p>
                ) : (
                    selectedTraits.map((trait) => (
                        <article
                            className="deck-traits__item"
                            key={trait.trait_id}
                        >
                            <h3>{trait.name}</h3>

                            <p>{trait.description}</p>

                            <p>
                                Intensité : {trait.intensity}
                            </p>

                            <div className="deck-traits__actions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDecrease(
                                            trait.trait_id
                                        )
                                    }
                                    disabled={
                                        trait.intensity <= 1
                                    }
                                >
                                    -1
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleIncrease(
                                            trait.trait_id
                                        )
                                    }
                                    disabled={
                                        trait.intensity >= 7 ||
                                        totalIntensity >= 9
                                    }
                                >
                                    +1
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            trait.trait_id
                                        )
                                    }
                                >
                                    Supprimer
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {actionError && (
                <p className="deck-traits__error">
                    {actionError}
                </p>
            )}

            <button
                type="button"
                onClick={handleSave}
                disabled={!canValidate || saving}
            >
                {saving
                    ? "Enregistrement..."
                    : "Valider les traits"}
            </button>
        </section>
    )
}

export default DeckTraits