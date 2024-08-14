import os
import logging

from models.base import DataResponse
from core.config import BASE_DIR_SRC

from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/text-audio")  # получение списка каталога и фалов
async def trening_audio(id_audio: str | None):
    """
    Обработка токенов и cookies
    :param config:
    :return:
    """
    logging.info(id_audio)
    # file_path = BASE_DIR_SRC + '\\sample-3s.mp3'  # укажите путь к вашему аудиофайлу
    file_path = BASE_DIR_SRC + '\\EF4e_Elementary_SB_1.10.mp3'  # укажите путь к вашему аудиофайлу
    logging.warning(file_path)
    return FileResponse(file_path, media_type='audio/mpeg', filename=os.path.basename(file_path))


@router.get("/audio-audio")  # получение списка каталога и фалов
async def trening_text(id_audio: str | None):
    """
    Обработка токенов и cookies
    :param config:
    :return:
    """
    logging.info(id_audio)
    # file_path = BASE_DIR_SRC + '\\sample-3s.mp3'  # укажите путь к вашему аудиофайлу
    file_path = BASE_DIR_SRC + '\\EF4e_Elementary_SB_1.10.mp3'  # укажите путь к вашему аудиофайлу
    logging.warning(file_path)
    return FileResponse(file_path, media_type='audio/mpeg', filename=os.path.basename(file_path))

@router.get("/audio-text")  # получение списка каталога и фалов
async def trening_text(id_audio: str | None):
    """
    Обработка токенов и cookies
    :param config:
    :return:
    """
    logging.info(id_audio)
    # file_path = BASE_DIR_SRC + '\\sample-3s.mp3'  # укажите путь к вашему аудиофайлу
    file_path = BASE_DIR_SRC + '\\EF4e_Elementary_SB_1.10.mp3'  # укажите путь к вашему аудиофайлу
    logging.warning(file_path)
    return FileResponse(file_path, media_type='audio/mpeg', filename=os.path.basename(file_path))


from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import uuid
import shutil

app = FastAPI()
class DataModel(BaseModel):
    key1: str
    key2: str

@app.post("/process_audio/")
async def process_audio(
    file: UploadFile = File(...),
    key1: str = Form(...),
    key2: str = Form(...)
):
    # Сохранение полученного аудиофайла
    file_path = f"received_{uuid.uuid4()}.wav"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Обработка словаря
    received_data = {
        "key1": key1,
        "key2": key2,
    }

    print(f"Received file: {file.filename}")
    print(f"Received data: {received_data}")

    # Допустим, мы изменяем словарь и создаем новый аудиофайл в ответ
    updated_data = {key: value.upper() for key, value in received_data.items()}

    # Создаем новый аудиофайл (в реальной задаче, здесь может быть обработка аудио)
    response_file_path = f"response_{uuid.uuid4()}.wav"
    shutil.copyfile(file_path, response_file_path)  # Для примера копируем файл

    # Возвращаем аудиофайл и обновленный словарь
    return JSONResponse(content={
        "file_path": response_file_path,
        "data": updated_data
    })

@app.get("/download_audio/{file_name}")
async def download_audio(file_name: str):
    file_path = f"./{file_name}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/wav", filename=file_name)
    else:
        return JSONResponse(content={"error": "File not found"}, status_code=404)