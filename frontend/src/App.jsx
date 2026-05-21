import { useEffect }    from "react";
import { useStore }     from "./store";

import { Header }       from "./components/layout/Header";
import { Sidebar }      from "./components/layout/Sidebar";
import { Toolbar }      from "./components/database/Toolbar";
import { DbTable }      from "./components/database/DbTable";
import { PaintingForm } from "./components/form/PaintingForm";
import { LabelList }    from "./components/labels/LabelList";

import s from "./App.module.css";

export default function App() {
  const refreshAll = useStore((st) => st.refreshAll);

  useEffect(() => { refreshAll(); }, []);

  return (
    <div className={s.root}>
      <Header />

      <div className={s.body}>
        <Sidebar />

        <div className={s.main}>
          <Toolbar />

          <div className={s.content}>
            <DbTable />
            <PaintingForm />
          </div>

          <LabelList />
        </div>
      </div>
    </div>
  );
}
