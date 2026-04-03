import { useEffect, useMemo, useState } from "react";
import styles from "./PokemonCard.module.css";

const TYPE_COLORS = {
  fire: { bg: "#ff6b3520", border: "#ff6b3560", text: "#ff8c5a" },
  water: { bg: "#4a9eff20", border: "#4a9eff60", text: "#4a9eff" },
  grass: { bg: "#4caf7d20", border: "#4caf7d60", text: "#4caf7d" },
  electric: { bg: "#e8a83820", border: "#e8a83860", text: "#e8a838" },
  psychic: { bg: "#ff5ca820", border: "#ff5ca860", text: "#ff5ca8" },
  ice: { bg: "#74cfe820", border: "#74cfe860", text: "#74cfe8" },
  dragon: { bg: "#6c4bff20", border: "#6c4bff60", text: "#9b7fff" },
  dark: { bg: "#55504820", border: "#55504860", text: "#aa9e8c" },
  fairy: { bg: "#ff9eed20", border: "#ff9eed60", text: "#ff9eed" },
  fighting: { bg: "#cc4c2c20", border: "#cc4c2c60", text: "#e8785a" },
  poison: { bg: "#a040a020", border: "#a040a060", text: "#c878c8" },
  ground: { bg: "#c8a84820", border: "#c8a84860", text: "#d4b864" },
  rock: { bg: "#b8a03820", border: "#b8a03860", text: "#ccc05a" },
  ghost: { bg: "#70589820", border: "#70589860", text: "#9878b8" },
  steel: { bg: "#b8c0c820", border: "#b8c0c860", text: "#c8d0d8" },
  bug: { bg: "#a8b82020", border: "#a8b82060", text: "#c8d838" },
  normal: { bg: "#a8a87820", border: "#a8a87860", text: "#c8c898" },
  flying: { bg: "#7098f820", border: "#7098f860", text: "#90b8ff" },
};

function TypeBadge({ type, multiplier = null, accent = "default" }) {
  const c = TYPE_COLORS[type] || {
    bg: "#44444420",
    border: "#44444460",
    text: "#aaaaaa",
  };
  const className = [styles.typeBadge];

  if (accent === "more") className.push(styles.typeBadgeMore);
  if (accent === "normal") className.push(styles.typeBadgeNormal);
  if (accent === "less") className.push(styles.typeBadgeLess);

  return (
    <span
      className={className.join(" ")}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {type}
      {multiplier != null && (
        <em className={styles.badgeMultiplier}>×{multiplier}</em>
      )}
    </span>
  );
}

async function fetchSprite(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    if (!res.ok) return null;
    const d = await res.json();
    return (
      d.sprites?.other?.["official-artwork"]?.front_default ||
      d.sprites?.front_default ||
      null
    );
  } catch {
    return null;
  }
}

function EvoStage({ name, sprite, isCurrent, isLast, level }) {
  return (
    <div className={styles.evoRow}>
      <div
        className={`${styles.evoStage} ${isCurrent ? styles.evoCurrent : ""}`}
      >
        <div className={styles.evoImgWrap}>
          {sprite ? (
            <img src={sprite} alt={name} className={styles.evoImg} />
          ) : (
            <div className={styles.evoImgPlaceholder}>?</div>
          )}
        </div>
        <span className={styles.evoName}>{name.replace(/-/g, " ")}</span>
        <span
          className={`${styles.evoCurBadge} ${!isCurrent ? styles.evoCurBadgePlaceholder : ""}`}
        >
          {isCurrent ? "current" : "current"}
        </span>
      </div>

      {!isLast && (
        <div className={styles.evoArrowCol}>
          {level && <span className={styles.evoLevel}>Lv. {level}</span>}
          <span className={styles.evoArrowIcon}>→</span>
        </div>
      )}
    </div>
  );
}

function formatMultiplier(value) {
  if (Number.isInteger(value)) return String(value);
  return String(value).replace(/^0\./, "0.");
}

const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function PokemonCard({ data }) {
  const [evolutions, setEvolutions] = useState([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [damageProfile, setDamageProfile] = useState({
    more: [],
    normal: [],
    less: [],
  });
  const [damageLoading, setDamageLoading] = useState(false);

  const isPokemon =
    data?.name !== undefined &&
    data?.sprites !== undefined &&
    data?.types !== undefined;

  useEffect(() => {
    if (!isPokemon) {
      setEvolutions([]);
      return;
    }

    let cancelled = false;
    setEvolutions([]);
    setEvoLoading(true);

    async function load() {
      try {
        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`,
        );
        if (!speciesRes.ok || cancelled) return;
        const species = await speciesRes.json();

        const chainRes = await fetch(species.evolution_chain.url);
        if (!chainRes.ok || cancelled) return;
        const chainData = await chainRes.json();

        const stages = [];
        function walk(link, minLevel = null) {
          if (!link) return;
          stages.push({ name: link.species.name, level: minLevel });
          for (const next of link.evolves_to ?? []) {
            const lvl = next.evolution_details?.[0]?.min_level ?? null;
            walk(next, lvl);
          }
        }
        walk(chainData.chain);

        const withSprites = await Promise.all(
          stages.map(async (s) => ({
            ...s,
            sprite: await fetchSprite(s.name),
          })),
        );

        if (!cancelled) setEvolutions(withSprites);
      } catch (_) {
        // silently ignore
      } finally {
        if (!cancelled) setEvoLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [data?.id, isPokemon]);

  useEffect(() => {
    if (!isPokemon) {
      setDamageProfile({ more: [], normal: [], less: [] });
      return;
    }

    let cancelled = false;
    setDamageProfile({ more: [], normal: [], less: [] });
    setDamageLoading(true);

    async function loadDamageProfile() {
      try {
        const attackerTypes = data.types?.map((t) => t.type.name) ?? [];
        const responses = await Promise.all(
          attackerTypes.map((type) =>
            fetch(`https://pokeapi.co/api/v2/type/${type}/`),
          ),
        );

        if (responses.some((res) => !res.ok) || cancelled) return;

        const payloads = await Promise.all(responses.map((res) => res.json()));
        const bestMultiplierByTarget = new Map(
          ALL_TYPES.map((type) => [type, 1]),
        );

        function multiplierAgainst(typeData, defendingType) {
          const relations = typeData.damage_relations;

          if (
            (relations.double_damage_to ?? []).some(
              (item) => item.name === defendingType,
            )
          )
            return 2;
          if (
            (relations.half_damage_to ?? []).some(
              (item) => item.name === defendingType,
            )
          )
            return 0.5;
          if (
            (relations.no_damage_to ?? []).some(
              (item) => item.name === defendingType,
            )
          )
            return 0;
          return 1;
        }

        for (const defendingType of ALL_TYPES) {
          let bestMultiplier = 0;

          for (const attackerTypeData of payloads) {
            const currentMultiplier = multiplierAgainst(
              attackerTypeData,
              defendingType,
            );
            if (currentMultiplier > bestMultiplier)
              bestMultiplier = currentMultiplier;
          }

          bestMultiplierByTarget.set(defendingType, bestMultiplier);
        }

        const more = [];
        const normal = [];
        const less = [];

        for (const [type, multiplier] of bestMultiplierByTarget.entries()) {
          const item = {
            type,
            multiplier: formatMultiplier(multiplier),
            rawMultiplier: multiplier,
          };

          if (multiplier > 1) {
            more.push(item);
          } else if (multiplier < 1) {
            less.push(item);
          } else {
            normal.push(item);
          }
        }

        more.sort(
          (a, b) =>
            b.rawMultiplier - a.rawMultiplier || a.type.localeCompare(b.type),
        );
        normal.sort((a, b) => a.type.localeCompare(b.type));
        less.sort(
          (a, b) =>
            a.rawMultiplier - b.rawMultiplier || a.type.localeCompare(b.type),
        );

        if (!cancelled) setDamageProfile({ more, normal, less });
      } catch (_) {
        // silently ignore
      } finally {
        if (!cancelled) setDamageLoading(false);
      }
    }

    loadDamageProfile();
    return () => {
      cancelled = true;
    };
  }, [data?.types, isPokemon]);

  const damageSummary = useMemo(
    () => [
      {
        key: "more",
        title: "More Damage",
        subtitle: "Types this Pokémon can hit super effectively",
        items: damageProfile.more,
        accent: "more",
        emptyText: "No super-effective targets found.",
      },
      {
        key: "normal",
        title: "Normal Damage",
        subtitle: "Types this Pokémon hits for standard damage",
        items: damageProfile.normal,
        accent: "normal",
        emptyText: "No neutral targets found.",
      },
      {
        key: "less",
        title: "Less Damage",
        subtitle: "Types this Pokémon hits for reduced or no damage",
        items: damageProfile.less,
        accent: "less",
        emptyText: "No resisted targets found.",
      },
    ],
    [damageProfile],
  );

  if (!isPokemon) return null;

  const name = data.name;
  const image =
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default;
  const types = data.types?.map((t) => t.type.name) ?? [];
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);

  return (
    <div className={styles.card}>
      <div className={styles.columns}>
        <div className={styles.topSection}>
          <div className={styles.imageWrap}>
            {image ? (
              <img src={image} alt={name} className={styles.image} />
            ) : (
              <div className={styles.noImage}>?</div>
            )}
            <div className={styles.imageBg} aria-hidden="true" />
          </div>

          <div className={styles.identity}>
            <p className={styles.pokeNumber}>
              #{String(data.id).padStart(4, "0")}
            </p>
            <h2 className={styles.pokeName}>{name}</h2>
            <div className={styles.types}>
              {types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{heightM} M</span>
              <span className={styles.statLabel}>altura</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>{weightKg} KG</span>
              <span className={styles.statLabel}>peso</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>{evolutions.length || "—"}</span>
              <span className={styles.statLabel}>evolutions</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.sectionTitle}>
            <span className={styles.sectionDot} />
            Evolutions
          </p>

          {evoLoading && (
            <div className={styles.evoLoading}>
              <span className={styles.spinner} />
              <span>Fetching evolution chain…</span>
            </div>
          )}

          {!evoLoading && evolutions.length === 0 && (
            <div className={styles.evoEmpty}>No evolution data found.</div>
          )}

          {!evoLoading && evolutions.length > 0 && (
            <div className={styles.evoChain}>
              {evolutions.map((evo, i) => (
                <EvoStage
                  key={evo.name}
                  name={evo.name}
                  sprite={evo.sprite}
                  level={evo.level}
                  isCurrent={evo.name === data.name}
                  isLast={i === evolutions.length - 1}
                />
              ))}
            </div>
          )}

          <div className={styles.matchupsSection}>
            <p className={styles.sectionTitle}>
              <span className={styles.sectionDot} />
              Damage Profile
            </p>

            {damageLoading ? (
              <div className={styles.evoLoading}>
                <span className={styles.spinner} />
                <span>Calculating damage profile…</span>
              </div>
            ) : (
              <div className={styles.matchupsGridThree}>
                {damageSummary.map((group) => (
                  <div key={group.key} className={styles.matchupCard}>
                    <div className={styles.matchupHeader}>
                      <h3 className={styles.matchupTitle}>{group.title}</h3>
                      <p className={styles.matchupSubtitle}>{group.subtitle}</p>
                    </div>

                    {group.items.length > 0 ? (
                      <div className={styles.matchupBadges}>
                        {group.items.map((item) => (
                          <TypeBadge
                            key={`${group.key}-${item.type}`}
                            type={item.type}
                            multiplier={item.multiplier}
                            accent={group.accent}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className={styles.matchupEmpty}>
                        {group.emptyText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
