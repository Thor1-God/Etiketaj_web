import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, "exhibition.db")

engine  = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


SAMPLE_DATA = [
    dict(inventory_number="КП-001", last_name="Репин",       first_name="Илья",     patronymic="Ефимович",      birth_year=1844, death_year=1930, year=1884, title="Не ждали",             material="Холст", technique="Масло", size="160×167 см", notes=""),
    dict(inventory_number="КП-002", last_name="Шишкин",      first_name="Иван",     patronymic="Иванович",      birth_year=1832, death_year=1898, year=1889, title="Утро в сосновом лесу", material="Холст", technique="Масло", size="139×213 см", notes=""),
    dict(inventory_number="КП-003", last_name="Левитан",     first_name="Исаак",    patronymic="Ильич",         birth_year=1860, death_year=1900, year=1890, title="Тихая обитель",        material="Холст", technique="Масло", size="87×108 см",  notes=""),
    dict(inventory_number="КП-004", last_name="Серов",       first_name="Валентин", patronymic="Александрович", birth_year=1865, death_year=1911, year=1887, title="Девочка с персиками",  material="Холст", technique="Масло", size="91×85 см",   notes=""),
    dict(inventory_number="КП-005", last_name="Айвазовский", first_name="Иван",     patronymic="Константинович",birth_year=1817, death_year=1900, year=1850, title="Девятый вал",          material="Холст", technique="Масло", size="221×332 см", notes=""),
    dict(inventory_number="КП-006", last_name="Васнецов",    first_name="Виктор",   patronymic="Михайлович",    birth_year=1848, death_year=1926, year=1898, title="Богатыри",             material="Холст", technique="Масло", size="295×446 см", notes=""),
    dict(inventory_number="КП-007", last_name="Репин",       first_name="Илья",     patronymic="Ефимович",      birth_year=1844, death_year=1930, year=1870, title="Бурлаки на Волге",    material="Холст", technique="Масло", size="131×281 см", notes=""),
    dict(inventory_number="КП-008", last_name="Левитан",     first_name="Исаак",    patronymic="Ильич",         birth_year=1860, death_year=1900, year=1895, title="Март",                 material="Холст", technique="Масло", size="60×75 см",   notes=""),
    dict(inventory_number="КП-009", last_name="Шишкин",      first_name="Иван",     patronymic="Иванович",      birth_year=1832, death_year=1898, year=1872, title="Сосновый бор",         material="Холст", technique="Масло", size="117×165 см", notes=""),
    dict(inventory_number="КП-010", last_name="Суриков",     first_name="Василий",  patronymic="Иванович",      birth_year=1848, death_year=1916, year=1887, title="Боярыня Морозова",     material="Холст", technique="Масло", size="304×587 см", notes=""),
]
