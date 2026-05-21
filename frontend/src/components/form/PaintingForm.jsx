import { useState, useEffect } from "react";
import { useStore }     from "../../store";
import { LabelPreview } from "./LabelPreview";
import { Spinner }      from "../ui/Spinner";
import {
  MATERIALS, TECHNIQUES,
  EMPTY_FORM, paintingToForm, formToPayload, validate,
} from "./formUtils";
import s from "./PaintingForm.module.css";

// ── Field wrappers ────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className={s.field}>
      <label className={s.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", list }) {
  return (
    <input
      className={s.input}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      list={list}
      autoComplete={list ? "off" : undefined}
    />
  );
}

/**
 * Editable combo: preset <select> + free-text <input> below it.
 * The select snaps to known values; the input allows any text.
 */
function ComboField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select
        className={s.select}
        value={options.includes(value) ? value : value ? "__custom__" : ""}
        onChange={(e) => {
          if (e.target.value !== "__custom__") onChange(e.target.value);
        }}
      >
        {options.map((o) => (
          <option key={o} value={o || ""}>{o || "— не указано —"}</option>
        ))}
        {value && !options.includes(value) && (
          <option value="__custom__">{value}</option>
        )}
      </select>
      <input
        className={`${s.input} ${s.customInput}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="или введите своё…"
      />
    </Field>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function PaintingForm() {
  const selected       = useStore((st) => st.selected);
  const artists        = useStore((st) => st.artists);
  const savePainting   = useStore((st) => st.savePainting);
  const deletePainting = useStore((st) => st.deletePainting);
  const setSelected    = useStore((st) => st.setSelected);
  const addToLabelList = useStore((st) => st.addToLabelList);
  const isInList       = useStore((st) => st.isInList);

  const isNew = !selected?.id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [msg,  setMsg]  = useState(null);   // { ok, text }
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(selected ? paintingToForm(selected) : EMPTY_FORM);
    setMsg(null);
  }, [selected]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Autocomplete: when last_name exactly matches an existing artist,
  // pre-fill the remaining empty artist fields.
  function onLastName(val) {
    set("last_name", val);
    const match = artists.find(
      (a) => a.last_name.toLowerCase() === val.toLowerCase()
    );
    if (!match) return;
    if (!form.first_name) set("first_name", match.first_name || "");
    if (!form.patronymic)  set("patronymic",  match.patronymic  || "");
    if (!form.birth_year && match.birth_year)
      set("birth_year", String(match.birth_year));
    if (!form.death_year && match.death_year)
      set("death_year", String(match.death_year));
  }

  async function handleSave() {
    const err = validate(form);
    if (err) { setMsg({ ok: false, text: err }); return; }
    setBusy(true); setMsg(null);
    try {
      await savePainting(formToPayload(form));
      setMsg({ ok: true, text: isNew ? "Добавлено!" : "Сохранено!" });
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Удалить «${selected.title}» из базы данных?`)) return;
    setBusy(true);
    try { await deletePainting(selected.id); }
    finally { setBusy(false); }
  }

  const inList = !isNew && isInList(selected?.id);

  return (
    <div className={s.panel}>
      {/* Header */}
      <div className={s.header}>
        <span className={s.headerTitle}>
          {isNew ? "Новая запись" : "Редактирование"}
        </span>
        {!isNew && (
          <button className={s.newBtn} onClick={() => setSelected(null)}>
            + Новая
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className={s.scroll}>
        <div className={s.body}>

          {/* Datalist for last_name autocomplete */}
          <datalist id="artist-names">
            {artists.map((a) => (
              <option key={a.last_name} value={a.last_name} />
            ))}
          </datalist>

          {/* ── Identification ── */}
          <p className={s.section}>Идентификация</p>
          <Field label="Инвентарный номер">
            <Input
              value={form.inventory_number}
              onChange={(v) => set("inventory_number", v)}
              placeholder="КП-001"
            />
          </Field>

          {/* ── Artist ── */}
          <p className={s.section}>Художник</p>

          <Field label="Фамилия *">
            <Input
              value={form.last_name}
              onChange={onLastName}
              placeholder="Репин"
              list="artist-names"
            />
          </Field>

          <div className={s.row2}>
            <Field label="Имя">
              <Input value={form.first_name} onChange={(v) => set("first_name", v)} placeholder="Илья" />
            </Field>
            <Field label="Отчество">
              <Input value={form.patronymic} onChange={(v) => set("patronymic", v)} placeholder="Ефимович" />
            </Field>
          </div>

          <div className={s.row2}>
            <Field label="Год рождения">
              <Input type="number" value={form.birth_year} onChange={(v) => set("birth_year", v)} placeholder="1844" />
            </Field>
            <Field label="Год смерти">
              <Input type="number" value={form.death_year} onChange={(v) => set("death_year", v)} placeholder="1930" />
            </Field>
          </div>

          {/* ── Work ── */}
          <p className={s.section}>Произведение</p>

          <div className={s.rowTitleYear}>
            <Field label="Название *">
              <Input value={form.title} onChange={(v) => set("title", v)} placeholder="Не ждали" />
            </Field>
            <Field label="Год *">
              <Input type="number" value={form.year} onChange={(v) => set("year", v)} placeholder="1884" />
            </Field>
          </div>

          <div className={s.row2}>
            <ComboField
              label="Материал"
              value={form.material}
              onChange={(v) => set("material", v)}
              options={MATERIALS}
            />
            <ComboField
              label="Техника"
              value={form.technique}
              onChange={(v) => set("technique", v)}
              options={TECHNIQUES}
            />
          </div>

          <Field label="Размер">
            <Input value={form.size} onChange={(v) => set("size", v)} placeholder="160×167 см" />
          </Field>

          <Field label="Примечания">
            <textarea
              className={`${s.input} ${s.textarea}`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Внутренние заметки…"
            />
          </Field>

          {/* ── Actions ── */}
          <div className={s.divider} />
          <div className={s.actions}>
            <button className={s.saveBtn} onClick={handleSave} disabled={busy}>
              {busy && <Spinner size={12} />}
              {isNew ? "Добавить в базу" : "Сохранить"}
            </button>

            {!isNew && (
              <button
                className={`${s.listBtn} ${inList ? s.listBtnIn : ""}`}
                disabled={inList}
                onClick={() => addToLabelList(selected)}
              >
                {inList ? "✓ В списке" : "+ В список"}
              </button>
            )}

            <div className={s.spacer} />

            {!isNew && (
              <button className={s.delBtn} onClick={handleDelete} disabled={busy}>
                Удалить
              </button>
            )}
          </div>

          {msg && (
            <p className={`${s.msg} ${msg.ok ? s.ok : s.err}`}>{msg.text}</p>
          )}
        </div>

        {/* Live label preview */}
        <LabelPreview form={form} />
      </div>
    </div>
  );
}
