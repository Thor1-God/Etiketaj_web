from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, Session, SAMPLE_DATA
from .models   import Painting
from .routes.paintings import router as paintings_router
from .routes.generate  import router as generate_router

app = FastAPI(title="Этикетаж API", version="1.0.0", docs_url="/api/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(paintings_router)
app.include_router(generate_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    with Session() as db:
        if db.query(Painting).count() == 0:
            db.add_all([Painting(**d) for d in SAMPLE_DATA])
            db.commit()


@app.get("/api")
def root():
    return {"status": "ok", "version": "1.0.0"}
