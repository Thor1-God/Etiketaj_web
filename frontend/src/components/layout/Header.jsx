import { useStore } from "../../store";
import s from "./Header.module.css";

export function Header() {
  const count     = useStore((st) => st.paintings.length);
  const listCount = useStore((st) => st.labelList.length);

  return (
    <header className={s.header}>
      <span className={s.logo}>Этикетаж</span>
      <div className={s.spacer} />
      <div className={s.stats}>
        <span>База:&nbsp;<strong>{count}</strong></span>
        <span className={s.dot}>·</span>
        <span>Список:&nbsp;<strong>{listCount}</strong></span>
      </div>
    </header>
  );
}
