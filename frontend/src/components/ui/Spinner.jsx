import s from "./Spinner.module.css";
export function Spinner({ size = 14 }) {
  return <span className={s.root} style={{ width: size, height: size }} />;
}
