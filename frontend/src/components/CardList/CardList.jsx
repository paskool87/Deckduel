import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import { getSpecialAbilities } from "../../services/specialAbilities";
import "./CardList.scss";

function CardList({ cards, deckId }) {
  const [abilities, setAbilities] = useState([]);

  useEffect(function () {
    async function loadAbilities() {
      try {
        const data = await getSpecialAbilities();
        setAbilities(data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des capacités spéciales :",
          error,
        );
      }
    }

    loadAbilities();
  }, []);

  return (
    <div className="card-list">
      {cards.map((card, index) => {
        const ability = abilities.find(function (item) {
          return (
            Number(item.id_special_abilities) ===
            Number(card.special_ability_id)
          );
        });

        return (
          <Link
            className="card-list__link"
            key={card.id_cards}
            to={`/decks/${deckId}/cards/${card.id_cards}?number=${index + 1}`}
          >
            <Card card={card} number={index + 1} abilityName={ability?.name} />
          </Link>
        );
      })}
    </div>
  );
}

export default CardList;
