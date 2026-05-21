import { useStore } from "../../store";
import s from "./LabelCard.module.css";

export function LabelCard({ painting: p }) {
  const removeFromLabelList = useStore((st) => st.removeFromLabelList);

  const fullName = [p.last_name, p.first_name, p.patronymic]
    .filter(Boolean)
    .join(" ");

  const life = p.birth_year
    ? p.death_year
      ? ` (${p.birth_year}–${p.death_year})`
      : ` (${p.birth_year})`
    : "";

  const mat = [p.material, p.technique].filter(Boolean).join(", ");

  return (
    <div className={s.card}>
      <button
        className={s.remove}
        onClick={() => removeFromLabelList(p.id)}
        title="Убрать из списка"
      >✕</button>

      {p.inventory_number && (
        <p className={s.inv}>{p.inventory_number}</p>
      )}
      <p className={s.author}>{fullName}{life}</p>
      <p className={s.title}>«{p.title}», {p.year}</p>
      {mat    && <p className={s.mat}>{mat}</p>}
      {p.size && <p className={s.mat}>{p.size}</p>}
    </div>
  );
}
