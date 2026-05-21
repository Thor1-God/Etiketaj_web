import { useSearch } from "../../hooks/useSearch";
import { useStore }  from "../../store";
import s from "./Toolbar.module.css";

const SORT_OPTIONS = [
  { value: "last_name:asc",        label: "Фамилия А→Я" },
  { value: "last_name:desc",       label: "Фамилия Я→А" },
  { value: "year:asc",             label: "Год создания (старые)" },
  { value: "year:desc",            label: "Год создания (новые)" },
  { value: "birth_year:asc",       label: "Год рождения (старые)" },
  { value: "title:asc",            label: "Название А→Я" },
  { value: "inventory_number:asc", label: "Инв. номер" },
];

export function Toolbar() {
  const { searchRaw, setSearchRaw, invRaw, setInvRaw, filters, setFilters } =
    useSearch();
  const setSelected = useStore((st) => st.setSelected);

  function handleSort(e) {
    const [sort, dir] = e.target.value.split(":");
    setFilters({ sort, dir });
  }

  return (
    <div className={s.toolbar}>
      <span className={s.label}>Поиск:</span>

      <input
        className={s.input}
        placeholder="Фамилия, имя, название…"
        value={searchRaw}
        onChange={(e) => setSearchRaw(e.target.value)}
      />
      <input
        className={`${s.input} ${s.short}`}
        placeholder="Инв. номер…"
        value={invRaw}
        onChange={(e) => setInvRaw(e.target.value)}
      />

      <div className={s.divider} />
      <span className={s.label}>Сорт.:</span>

      <select
        className={s.select}
        value={`${filters.sort}:${filters.dir}`}
        onChange={handleSort}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className={s.divider} />

      <button className={s.newBtn} onClick={() => setSelected(null)}>
        + Новая запись
      </button>
    </div>
  );
}
