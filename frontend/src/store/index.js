import { create } from "zustand";
import { paintingsApi, generateDocx } from "../api";

export const useStore = create((set, get) => ({
  // ── Server data ───────────────────────────────────────────────────────────
  paintings:  [],
  artists:    [],
  loading:    false,
  error:      null,

  // ── Filters ───────────────────────────────────────────────────────────────
  filters: {
    search: "",
    inv:    "",
    artist: "",
    sort:   "last_name",
    dir:    "asc",
  },

  // ── Currently edited painting ─────────────────────────────────────────────
  selected: null,   // null  = "new" form

  // ── Label list for printing ───────────────────────────────────────────────
  labelList:  [],
  genLoading: false,
  genMsg:     null,

  // ── Actions ───────────────────────────────────────────────────────────────

  setFilters(patch) {
    set((s) => ({ filters: { ...s.filters, ...patch } }));
    get().fetchPaintings();
  },

  setSelected: (p) => set({ selected: p }),

  async fetchPaintings() {
    set({ loading: true, error: null });
    try {
      const paintings = await paintingsApi.list(get().filters);
      set({ paintings, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  async fetchArtists() {
    try {
      set({ artists: await paintingsApi.artists() });
    } catch { /* silent */ }
  },

  refreshAll() {
    get().fetchPaintings();
    get().fetchArtists();
  },

  async savePainting(data) {
    const { selected } = get();
    const p = selected?.id
      ? await paintingsApi.update(selected.id, data)
      : await paintingsApi.create(data);
    set({ selected: p });
    // Keep label list cards up-to-date
    set((s) => ({ labelList: s.labelList.map((x) => (x.id === p.id ? p : x)) }));
    get().refreshAll();
    return p;
  },

  async deletePainting(id) {
    await paintingsApi.remove(id);
    set({ selected: null });
    set((s) => ({ labelList: s.labelList.filter((x) => x.id !== id) }));
    get().refreshAll();
  },

  // ── Label list ────────────────────────────────────────────────────────────

  addToLabelList(painting) {
    if (get().labelList.some((x) => x.id === painting.id)) return;
    set((s) => ({ labelList: [...s.labelList, painting] }));
  },

  removeFromLabelList: (id) =>
    set((s) => ({ labelList: s.labelList.filter((x) => x.id !== id) })),

  clearLabelList: () => set({ labelList: [] }),

  isInList: (id) => get().labelList.some((x) => x.id === id),

  async generate() {
    const { labelList } = get();
    if (!labelList.length) return;
    set({ genLoading: true, genMsg: null });
    try {
      await generateDocx(labelList);
      set({ genMsg: { ok: true, text: "Файл скачан!" } });
    } catch (e) {
      set({ genMsg: { ok: false, text: e.message } });
    } finally {
      set({ genLoading: false });
    }
  },
}));
