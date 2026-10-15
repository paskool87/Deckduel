import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getDeckById } from "../../services/decks";
import { updateCard } from "../../services/cards";
import { getSpecialAbilities } from "../../services/specialAbilities";
import "./CardEdit.scss";

function CardEdit() {
  const { deckId, cardId } = useParams();
  
  const [searchParams] = useSearchParams();
  const cardNumber = searchParams.get("number");

  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [health, setHealth] = useState(0);
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [selectedAbilityId, setSelectedAbilityId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [deckData, abilitiesData] = await Promise.all([
          getDeckById(deckId),
          getSpecialAbilities(),
        ]);

        const currentCard = deckData.cards?.find(
          (item) => String(item.id_cards) === String(cardId),
        );

        setDeck(deckData);
        setAbilities(abilitiesData);

        if (!currentCard) {
          setCard(null);
          return;
        }

        setCard(currentCard);
        setHealth(Number(currentCard.health));
        setAttack(Number(currentCard.attack));
        setDefense(Number(currentCard.defense));
        setSelectedAbilityId(
          currentCard.special_ability_id == null
            ? ""
            : String(currentCard.special_ability_id),
        );
      } catch (err) {
        console.error("Erreur lors du chargement de la carte :", err);
        setError("Impossible de charger la carte et ses capacités.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [deckId, cardId]);

  const totalStats = health + attack + defense;

  const otherCards = (deck?.cards ?? []).filter(
    (item) => String(item.id_cards) !== String(cardId),
  );

  const usedAbilityIds = new Set(
    otherCards
      .filter((item) => item.special_ability_id != null)
      .map((item) => String(item.special_ability_id)),
  );

  const equippedCardsCount = otherCards.filter(
    (item) => item.special_ability_id != null,
  ).length;

  const currentAbilityId =
    card?.special_ability_id == null ? "" : String(card.special_ability_id);

  const abilitySlotsFull = equippedCardsCount >= 5 && currentAbilityId === "";

  const selectedAbility = abilities.find(
    (ability) => String(ability.id_special_abilities) === selectedAbilityId,
  );

  function changeStat(stat, amount) {
    setError("");

    const setters = {
      health: setHealth,
      attack: setAttack,
      defense: setDefense,
    };

    const values = {
      health,
      attack,
      defense,
    };

    const minimum = stat === "health" ? 10 : 0;
    const nextValue = values[stat] + amount;

    if (nextValue < minimum || nextValue > 100) {
      return;
    }

    setters[stat](nextValue);
  }

  function isAbilityUnavailable(ability) {
    const abilityId = String(ability.id_special_abilities);

    if (usedAbilityIds.has(abilityId)) {
      return true;
    }

    if (abilitySlotsFull && abilityId !== currentAbilityId) {
      return true;
    }

    return false;
  }

  function getAbilityUnavailableMessage(ability) {
    const abilityId = String(ability.id_special_abilities);

    if (usedAbilityIds.has(abilityId)) {
      return "Cette capacité est déjà utilisée par une autre carte.";
    }

    if (abilitySlotsFull && abilityId !== currentAbilityId) {
      return "Les cinq emplacements de capacités sont déjà utilisés.";
    }

    return "";
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");

    if (health < 10) {
      setError("La vie doit être supérieure ou égale à 10.");
      return;
    }

    if (
      health < 0 ||
      health > 100 ||
      attack < 0 ||
      attack > 100 ||
      defense < 0 ||
      defense > 100
    ) {
      setError("Chaque caractéristique doit être comprise entre 0 et 100.");
      return;
    }

    if (totalStats !== 100) {
      setError("Le total des caractéristiques doit être égal à 100.");
      return;
    }

    try {
      setSaving(true);

      await updateCard(deckId, cardId, {
        health,
        attack,
        defense,
        special_ability_id:
          selectedAbilityId === "" ? null : Number(selectedAbilityId),
      });

      navigate(`/decks/${deckId}/cards`);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la carte :", err);

      const errorCode =
        err?.response?.data?.code ?? err?.response?.data?.error ?? err?.code;

      const errorMessages = {
        INVALID_HEALTH: "La vie doit être supérieure ou égale à 10.",
        INVALID_STAT:
          "Les caractéristiques doivent être comprises entre 0 et 100.",
        INVALID_STATS_TOTAL:
          "Le total des caractéristiques doit être égal à 100.",
        SPECIAL_ABILITY_ALREADY_USED:
          "Cette capacité est déjà utilisée par une autre carte.",
        SPECIAL_CARDS_FULL:
          "Le deck possède déjà cinq cartes avec une capacité spéciale.",
        SPECIAL_ABILITY_NOT_FOUND:
          "La capacité spéciale sélectionnée n'existe pas.",
        CARD_NOT_FOUND: "La carte demandée est introuvable.",
        DECK_NOT_ALLOWED: "Vous n'êtes pas autorisé à modifier cette carte.",
      };

      setError(
        errorMessages[errorCode] ??
          "Impossible d'enregistrer les modifications de la carte.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="card-edit">
        <p>Chargement de la carte...</p>
      </section>
    );
  }

  if (!card || !deck) {
    return (
      <section className="card-edit">
        <h1>Modifier une carte</h1>
        <p className="card-edit__error">
          {error || "La carte ou le deck demandé est introuvable."}
        </p>
        <Link className="card-edit__back" to={`/decks/${deckId}/cards`}>
          Retour aux cartes
        </Link>
      </section>
    );
  }

  return (
    <section className="card-edit">
      <header className="card-edit__header">
        <div>
          <h1>Modifier une carte</h1>
          <p>Deck : {deck.name ?? "Deck sans nom"} | Carte n° {cardNumber}</p>
        </div>

        <Link className="card-edit__back" to={`/decks/${deckId}/cards`}>
          Retour aux cartes
        </Link>
      </header>

      <form className="card-edit__form" onSubmit={handleSave}>
        <div className="card-edit__layout">
          <div className="card-edit__left">
            <section className="card-edit__panel card-edit__characteristics">
              <h2>Caractéristiques</h2>

              <div className="card-edit__stats">
                <div className="card-edit__stat">
                  <span className="card-edit__stat-name">Vie</span>

                  <div className="card-edit__stat-controls">
                    <button
                      type="button"
                      onClick={() => changeStat("health", -10)}
                      disabled={health <= 10 || saving}
                      aria-label="Diminuer la vie"
                    >
                      −
                    </button>
                    <strong>{health}</strong>
                    <button
                      type="button"
                      onClick={() => changeStat("health", 10)}
                      disabled={health >= 100 || saving}
                      aria-label="Augmenter la vie"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="card-edit__stat">
                  <span className="card-edit__stat-name">Attaque</span>

                  <div className="card-edit__stat-controls">
                    <button
                      type="button"
                      onClick={() => changeStat("attack", -10)}
                      disabled={attack <= 0 || saving}
                      aria-label="Diminuer l'attaque"
                    >
                      −
                    </button>
                    <strong>{attack}</strong>
                    <button
                      type="button"
                      onClick={() => changeStat("attack", 10)}
                      disabled={attack >= 100 || saving}
                      aria-label="Augmenter l'attaque"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="card-edit__stat">
                  <span className="card-edit__stat-name">Défense</span>

                  <div className="card-edit__stat-controls">
                    <button
                      type="button"
                      onClick={() => changeStat("defense", -10)}
                      disabled={defense <= 0 || saving}
                      aria-label="Diminuer la défense"
                    >
                      −
                    </button>
                    <strong>{defense}</strong>
                    <button
                      type="button"
                      onClick={() => changeStat("defense", 10)}
                      disabled={defense >= 100 || saving}
                      aria-label="Augmenter la défense"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`card-edit__total ${
                  totalStats === 100
                    ? "card-edit__total--valid"
                    : "card-edit__total--invalid"
                }`}
              >
                <span>Total des caractéristiques</span>
                <strong>{totalStats} / 100</strong>
              </div>
            </section>

            <section className="card-edit__panel card-edit__selected">
              <h2>Capacité spéciale sélectionnée</h2>

              {selectedAbility ? (
                <div className="card-edit__selected-ability">
                  <h3>{selectedAbility.name}</h3>
                  <p>{selectedAbility.description}</p>

                  <button
                    className="card-edit__remove-ability"
                    type="button"
                    onClick={() => {
                      setSelectedAbilityId("");
                      setError("");
                    }}
                    disabled={saving}
                  >
                    Retirer cette capacité
                  </button>
                </div>
              ) : (
                <p className="card-edit__none">
                  Aucune capacité spéciale sélectionnée.
                </p>
              )}
            </section>

            <footer className="card-edit__footer">
              <Link className="card-edit__cancel" to={`/decks/${deckId}/cards`}>
                Annuler
              </Link>

              <button
                className="card-edit__save"
                type="submit"
                disabled={saving || totalStats !== 100}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </footer>

            {error && (
              <p className="card-edit__error" role="alert">
                {error}
              </p>
            )}
          </div>

          <aside className="card-edit__abilities">
            <div className="card-edit__abilities-header">
              <h2>Capacités disponibles</h2>
              <p className="card-edit__hint">
                Une capacité par carte, avec un maximum de cinq cartes équipées
                dans le deck.
              </p>
            </div>

            <div className="card-edit__abilities-list">
              <button
                className={`card-edit__ability ${
                  selectedAbilityId === "" ? "card-edit__ability--selected" : ""
                }`}
                type="button"
                onClick={() => {
                  setSelectedAbilityId("");
                  setError("");
                }}
                disabled={saving}
              >
                <strong>Aucune capacité spéciale</strong>
                <span>La carte ne possède pas de capacité spéciale.</span>
              </button>

              {abilities.map((ability) => {
                const abilityId = String(ability.id_special_abilities);
                const unavailable = isAbilityUnavailable(ability);
                const selected = selectedAbilityId === abilityId;

                return (
                  <button
                    key={ability.id_special_abilities}
                    className={`card-edit__ability ${
                      selected ? "card-edit__ability--selected" : ""
                    } ${unavailable ? "card-edit__ability--unavailable" : ""}`}
                    type="button"
                    onClick={() => {
                      if (unavailable) {
                        return;
                      }

                      setSelectedAbilityId(abilityId);
                      setError("");
                    }}
                    disabled={unavailable || saving}
                    title={
                      unavailable ? getAbilityUnavailableMessage(ability) : ""
                    }
                  >
                    <strong>{ability.name}</strong>
                    <span>{ability.description}</span>

                    {unavailable && (
                      <small>{getAbilityUnavailableMessage(ability)}</small>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}

export default CardEdit;
