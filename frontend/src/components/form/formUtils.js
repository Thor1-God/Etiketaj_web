export const MATERIALS = [
  "", "Холст", "ДВП", "Картон", "Бумага",
  "Дерево", "Шёлк", "Фанера", "Металл",
];

export const TECHNIQUES = [
  "", "Масло", "Акрил", "Гуашь", "Акварель",
  "Тушь", "Пастель", "Темпера", "Смешанная техника",
  "Графитный карандаш", "Цветные карандаши",
  "Сангина", "Уголь", "Офорт", "Литография",
];

export const EMPTY_FORM = {
  inventory_number: "",
  last_name: "", first_name: "", patronymic: "",
  birth_year: "", death_year: "",
  year: String(new Date().getFullYear()),
  title: "", material: "", technique: "", size: "", notes: "",
};

export const paintingToForm = (p) => ({
  inventory_number: p.inventory_number ?? "",
  last_name:        p.last_name        ?? "",
  first_name:       p.first_name       ?? "",
  patronymic:       p.patronymic       ?? "",
  birth_year:       p.birth_year != null ? String(p.birth_year) : "",
  death_year:       p.death_year != null ? String(p.death_year) : "",
  year:             String(p.year)     ?? "",
  title:            p.title            ?? "",
  material:         p.material         ?? "",
  technique:        p.technique        ?? "",
  size:             p.size             ?? "",
  notes:            p.notes            ?? "",
});

export const formToPayload = (f) => ({
  ...f,
  year:       parseInt(f.year)       || 0,
  birth_year: parseInt(f.birth_year) || null,
  death_year: parseInt(f.death_year) || null,
});

export const validate = (f) => {
  if (!f.last_name.trim()) return "Введите фамилию художника";
  if (!f.title.trim())     return "Введите название работы";
  if (!f.year)             return "Введите год создания";
  return null;
};
