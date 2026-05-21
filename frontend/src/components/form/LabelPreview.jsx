import s from "./LabelPreview.module.css";

export function LabelPreview({ form: f }) {
  const fullName = [f.last_name || "Фамилия", f.first_name, f.patronymic]
    .filter(Boolean)
    .join(" ");

  const life = f.birth_year
    ? f.death_year
      ? ` (${f.birth_year}–${f.death_year})`
      : ` (${f.birth_year})`
    : "";

  const mat = [f.material, f.technique].filter(Boolean).join(", ");

  return (
    <div className={s.wrap}>
      <p className={s.label}>Предпросмотр этикетки</p>
      <div className={s.card}>
        <p className={s.author}>{fullName}{life}</p>
        <p className={s.title}>«{f.title || "Название"}», {f.year || "????"} г.</p>
        {mat    && <p className={s.mat}>{mat}</p>}
        {f.size && <p className={s.size}>{f.size}</p>}
        {f.inventory_number && (
          <p className={s.inv}>{f.inventory_number}</p>
        )}
      </div>
    </div>
  );
}
