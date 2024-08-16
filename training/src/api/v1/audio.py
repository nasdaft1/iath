import os
import logging

from models.base import DataResponse
from core.config import BASE_DIR_SRC

from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/download-audio")  # получение списка каталога и фалов
async def download_audio(id_audio: str | None):
    logging.info(id_audio)
    # file_path = BASE_DIR_SRC + '\\sample-3s.mp3'  # укажите путь к вашему аудиофайлу
    file_path = BASE_DIR_SRC + '\\EF4e_Elementary_SB_1.10.mp3'  # укажите путь к вашему аудиофайлу
    logging.warning(file_path)
    return FileResponse(file_path, media_type='audio/mpeg', filename=os.path.basename(file_path))