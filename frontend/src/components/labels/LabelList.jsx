import { useStore }  from "../../store";
import { LabelCard } from "./LabelCard";
import { Spinner }   from "../ui/Spinner";
import s from "./LabelList.module.css";

export function LabelList() {
  const labelList      = useStore((st) => st.labelList);
  const clearLabelList = useStore((st) => st.clearLabelList);
  const generate       = useStore((st) => st.generate);
  const genLoading     = useStore((st) => st.genLoading);
  const genMsg         = useStore((st) => st.genMsg);

  return (
    <div className={s.panel}>
      {/* Header */}
      <div className={s.header}>
        <span className={s.title}>Список для генерации</span>

        {labelList.length > 0 && (
          <span className={s.badge}>{labelList.length} эт.</span>
        )}

        {labelList.length > 1 && (
          <button
            className={s.clearBtn}
            onClick={() => { if (confirm("Очистить список?")) clearLabelList(); }}
          >
            Очистить
          </button>
        )}
      </div>

      {/* Cards strip */}
      <div className={s.strip}>
        {labelList.length === 0 ? (
          <p className={s.empty}>
            Нажмите «+» рядом с картиной, чтобы добавить её в список
          </p>
        ) : (
          labelList.map((p) => <LabelCard key={p.id} painting={p} />)
        )}
      </div>

      {/* Generate bar */}
      <div className={s.genBar}>
        <span className={s.hint}>
          {labelList.length === 0
            ? "Список пуст"
            : `${labelList.length} эт.  ·  A4, один столбец, с зазорами для разрезки`}
        </span>

        {genMsg && (
          <span className={`${s.genMsg} ${genMsg.ok ? s.genOk : s.genErr}`}>
            {genMsg.text}
          </span>
        )}

        <button
          className={s.genBtn}
          disabled={!labelList.length || genLoading}
          onClick={generate}
        >
          {genLoading && <Spinner size={13} />}
          Генерировать .docx
        </button>
      </div>
    </div>
  );
}
