import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { useStore }    from "../store";

export function useSearch() {
  const setFilters = useStore((s) => s.setFilters);
  const filters    = useStore((s) => s.filters);

  const [searchRaw, setSearchRaw] = useState(filters.search);
  const [invRaw,    setInvRaw]    = useState(filters.inv);

  const dSearch = useDebounce(searchRaw, 280);
  const dInv    = useDebounce(invRaw,    280);

  useEffect(() => { setFilters({ search: dSearch }); }, [dSearch]);
  useEffect(() => { setFilters({ inv:    dInv });    }, [dInv]);

  return { searchRaw, setSearchRaw, invRaw, setInvRaw, filters, setFilters };
}
