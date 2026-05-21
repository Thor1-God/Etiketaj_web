import { useStore } from "../../store";
import { Spinner }  from "../ui/Spinner";
import s from "./DbTable.module.css";

const COLS = [
  { key: "inventory_number", label: "Инв. №",          sort: true,  w: "78px"  },
  { key: "last_name",        label: "Художник",         sort: true,  w: "180px" },
  { key: "year",             label: "Год",              sort: true,  w: "56px"  },
  { key: "title",            label: "Название",         sort: true,  w: "auto"  },
  { key: "mat",              label: "Материал/техника", sort: false, w: "148px" },
  { key: "_add",             label: "",                 sort: false, w: "58px"  },
];

const matLine  = (p) => [p.material, p.technique].filter(Boolean).join(", ");
const initials = (p) => {
  const fi = p.first_name?.[0] ? p.first_name[0] + "." : "";
  const pi = p.patronymic?.[0]  ? p.patronymic[0]  + "." : "";
  return fi + pi;
};

export function DbTable() {
  const paintings      = useStore((st) => st.paintings);
  const loading        = useStore((st) => st.loading);
  const selected       = useStore((st) => st.selected);
  const setSelected    = useStore((st) => st.setSelected);
  const labelList      = useStore((st) => st.labelList);
  const addToLabelList = useStore((st) => st.addToLabelList);
  const filters        = useStore((st) => st.filters);
  const setFilters     = useStore((st) => st.setFilters);

  const inList = (id) => labelList.some((x) => x.id === id);

  function handleSort(key) {
    if (!COLS.find((c) => c.key === key)?.sort) return;
    if (filters.sort === key)
      setFilters({ dir: filters.dir === "asc" ? "desc" : "asc" });
    else
      setFilters({ sort: key, dir: "asc" });
  }

  function sortIcon(key) {
    if (filters.sort !== key) return <span className={s.sortNeutral}>⇅</span>;
    return <span className={s.sortActive}>{filters.dir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className={s.wrapper}>
      {/* Panel header */}
      <div className={s.panelHdr}>
        <span className={s.panelTitle}>База данных</span>
        {filters.artist && (
          <span className={s.filterChip}>
            {filters.artist}
            <button
              className={s.chipX}
              onClick={() => setFilters({ artist: "" })}
            >✕</button>
          </span>
        )}
        <span className={s.count}>{paintings.length} записей</span>
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        {loading && (
          <div className={s.overlay}><Spinner size={22} /></div>
        )}
        <table className={s.table}>
          <colgroup>
            {COLS.map((c) => (
              <col key={c.key} style={c.w !== "auto" ? { width: c.w } : {}} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={[
                    s.th,
                    c.sort ? s.sortable : "",
                    filters.sort === c.key ? s.activeSort : "",
                  ].join(" ")}
                  onClick={() => handleSort(c.key)}
                >
                  {c.label}
                  {c.sort && sortIcon(c.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paintings.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={s.empty}>Ничего не найдено</td>
              </tr>
            )}
            {paintings.map((p) => {
              const il  = inList(p.id);
              const sel = selected?.id === p.id;
              return (
                <tr
                  key={p.id}
                  className={[
                    s.row,
                    sel ? s.selected : "",
                    il  ? s.inList   : "",
                  ].join(" ")}
                  onClick={() => setSelected(p)}
                >
                  <td className={s.tdInv}>{p.inventory_number || "—"}</td>
                  <td className={s.tdAuthor}>
                    {il && <span className={s.checkMark}>✓</span>}
                    {p.last_name} {initials(p)}
                  </td>
                  <td className={s.tdYear}>{p.year}</td>
                  <td className={s.tdTitle}>{p.title}</td>
                  <td className={s.tdMat}>{matLine(p) || "—"}</td>
                  <td className={s.tdAction}>
                    <button
                      className={`${s.addBtn} ${il ? s.addBtnIn : ""}`}
                      disabled={il}
                      title={il ? "Уже в списке" : "Добавить в список"}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToLabelList(p);
                      }}
                    >
                      {il ? "✓" : "+"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
