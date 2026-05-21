import os
import json
import tempfile
import subprocess

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..schemas import GenerateRequest

router = APIRouter(prefix="/api", tags=["generate"])

# Path to the Node.js generation script (sits next to backend/)
_HERE       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX_SCRIPT = os.path.normpath(os.path.join(_HERE, "..", "docx-gen", "generate.js"))


@router.post("/generate")
def generate(body: GenerateRequest):
    if not body.paintings:
        raise HTTPException(400, "Список пуст")

    paintings = [p.model_dump() for p in body.paintings]

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False, encoding="utf-8"
    ) as f:
        json.dump(paintings, f, ensure_ascii=False)
        inp = f.name

    out = inp.replace(".json", ".docx")

    try:
        result = subprocess.run(
            ["node", DOCX_SCRIPT, inp, out],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode != 0:
            raise HTTPException(500, f"Ошибка генерации: {result.stderr}")

        encoded = "".join(f"%{b:02X}" for b in "этикетаж.docx".encode())
        headers = {
            "Content-Disposition":
                f'attachment; filename="labels.docx"; filename*=UTF-8\'\'{encoded}'
        }
        return FileResponse(
            out,
            media_type=(
                "application/vnd.openxmlformats-officedocument"
                ".wordprocessingml.document"
            ),
            headers=headers,
        )
    finally:
        try:
            os.unlink(inp)
        except OSError:
            pass
        # out is deleted by FileResponse after streaming
