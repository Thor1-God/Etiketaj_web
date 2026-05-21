import { useState } from "react";
import { useStore }  from "../../store";
import s from "./Sidebar.module.css";

function ArtistNode({ artist, active, onSelect, onWorkClick }) {
  const [open, setOpen] = useState(false);

  const fi   = artist.first_name?.[0] ? artist.first_name[0] + "." : "";
  const pi   = artist.patronymic?.[0]  ? artist.patronymic[0]  + "." : "";
  const life = artist.birth_year
    ? artist.death_year
      ? ` (${artist.birth_year}–${artist.death_year})`
      : ` (${artist.birth_year})`
    : "";

  function toggle() {
    setOpen((v) => !v);
    onSelect(active ? "" : artist.last_name);
  }

  return (
    <div className={s.node}>
      <button
        className={`${s.artistBtn} ${active ? s.artistActive : ""}`}
        onClick={toggle}
      >
        <span className={s.arrow}>{open ? "▾" : "▸"}</span>
        <span className={s.artistName}>
          {artist.last_name} {fi}{pi}
        </span>
        <span className={s.life}>{life}</span>
        <span className={s.cnt}>{artist.count}</span>
      </button>

      {open && (
        <div className={s.works}>
          {artist.paintings.map((w) => (
            <button
              key={w.id}
              className={s.workBtn}
              onClick={() => onWorkClick(w.id)}
            >
              «{w.title}», {w.year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const artists        = useStore((st) => st.artists);
  const filters        = useStore((st) => st.filters);
  const setFilters     = useStore((st) => st.setFilters);
  const paintings      = useStore((st) => st.paintings);
  const setSelected    = useStore((st) => st.setSelected);
  const fetchPaintings = useStore((st) => st.fetchPaintings);

  async function handleWorkClick(id) {
    setFilters({ artist: "" });
    await fetchPaintings();
    const found = paintings.find((p) => p.id === id);
    if (found) setSelected(found);
  }

  return (
    <aside className={s.sidebar}>
      <div className={s.title}>Художники</div>

      <button
        className={`${s.allBtn} ${!filters.artist ? s.allActive : ""}`}
        onClick={() => setFilters({ artist: "" })}
      >
        Все работы
      </button>

      <div className={s.list}>
        {artists.map((a) => (
          <ArtistNode
            key={`${a.last_name}${a.first_name}`}
            artist={a}
            active={filters.artist === a.last_name}
            onSelect={(v) => setFilters({ artist: v })}
            onWorkClick={handleWorkClick}
          />
        ))}
      </div>
    </aside>
  );
}
