from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from ..database import get_db
from ..models   import Painting
from ..schemas  import PaintingCreate, PaintingUpdate, PaintingOut, ArtistOut

router = APIRouter(prefix="/api/paintings", tags=["paintings"])

VALID_SORT = {"last_name", "year", "title", "inventory_number", "birth_year"}


@router.get("", response_model=list[PaintingOut])
def list_paintings(
    search: str = Query(""),
    artist: str = Query(""),
    inv:    str = Query(""),
    sort:   str = Query("last_name"),
    dir:    str = Query("asc"),
    db:     Session = Depends(get_db),
):
    col   = sort if sort in VALID_SORT else "last_name"
    attr  = getattr(Painting, col)
    order = attr.asc() if dir == "asc" else attr.desc()

    q = db.query(Painting)
    if search:
        q = q.filter(or_(
            Painting.last_name.ilike(f"%{search}%"),
            Painting.first_name.ilike(f"%{search}%"),
            Painting.title.ilike(f"%{search}%"),
            Painting.inventory_number.ilike(f"%{search}%"),
        ))
    if artist:
        q = q.filter(Painting.last_name.ilike(f"%{artist}%"))
    if inv:
        q = q.filter(Painting.inventory_number.ilike(f"%{inv}%"))

    return q.order_by(order).all()


@router.get("/artists", response_model=list[ArtistOut])
def list_artists(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Painting.last_name, Painting.first_name,
            Painting.patronymic, Painting.birth_year, Painting.death_year,
        )
        .distinct()
        .order_by(Painting.last_name)
        .all()
    )
    result = []
    for row in rows:
        works = (
            db.query(Painting)
            .filter(
                Painting.last_name  == row.last_name,
                Painting.first_name == row.first_name,
                Painting.patronymic == row.patronymic,
            )
            .order_by(Painting.year)
            .all()
        )
        result.append(ArtistOut(
            last_name=row.last_name, first_name=row.first_name,
            patronymic=row.patronymic, birth_year=row.birth_year,
            death_year=row.death_year, count=len(works),
            paintings=[{"id": p.id, "title": p.title, "year": p.year} for p in works],
        ))
    return result


@router.get("/{painting_id}", response_model=PaintingOut)
def get_painting(painting_id: int, db: Session = Depends(get_db)):
    p = db.get(Painting, painting_id)
    if not p:
        raise HTTPException(404, "Не найдено")
    return p


@router.post("", response_model=PaintingOut, status_code=201)
def create_painting(body: PaintingCreate, db: Session = Depends(get_db)):
    p = Painting(**body.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p


@router.put("/{painting_id}", response_model=PaintingOut)
def update_painting(painting_id: int, body: PaintingUpdate, db: Session = Depends(get_db)):
    p = db.get(Painting, painting_id)
    if not p:
        raise HTTPException(404, "Не найдено")
    for k, v in body.model_dump().items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p


@router.delete("/{painting_id}")
def delete_painting(painting_id: int, db: Session = Depends(get_db)):
    p = db.get(Painting, painting_id)
    if not p:
        raise HTTPException(404, "Не найдено")
    db.delete(p); db.commit()
    return {"ok": True}
