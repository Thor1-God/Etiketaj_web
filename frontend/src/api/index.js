const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Ошибка запроса");
  }
  return res;
}

const json = (path, opts) => request(path, opts).then((r) => r.json());

// ── Paintings ─────────────────────────────────────────────────────────────────

export const paintingsApi = {
  list(params = {}) {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v != null)
      )
    );
    return json(`/paintings?${q}`);
  },

  get:     (id)       => json(`/paintings/${id}`),
  create:  (data)     => json("/paintings", { method: "POST", body: JSON.stringify(data) }),
  update:  (id, data) => json(`/paintings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove:  (id)       => json(`/paintings/${id}`, { method: "DELETE" }),
  artists: ()         => json("/paintings/artists"),
};

// ── Generate ──────────────────────────────────────────────────────────────────

export async function generateDocx(paintings) {
  const res  = await request("/generate", {
    method: "POST",
    body:   JSON.stringify({ paintings }),
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "этикетаж.docx";
  a.click();
  URL.revokeObjectURL(url);
}
