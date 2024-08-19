import logging
from typing import Any, Generator, BinaryIO
import json
import os
import random
import uuid

from models.base import DataTraining, DataTrainingResponse
from core.config import BASE_DIR_SRC

from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse, StreamingResponse

router = APIRouter()


# Открытие файла и загрузка его в переменную


@router.post("/answer-audio")
async def answer_audio(
        audio: UploadFile = File(...),
        data: str = Form(...)
) -> DataTrainingResponse:
    # Обработка аудиофайла
    audio_content = await audio.read()

    # Обработка JSON данных
    json_data = json.loads(data)
    logging.debug(json_data)
    logging.debug(f"Size of audio content: {len(audio_content)} bytes")

    # Сохранение файла на диск
    file_path = os.path.join(BASE_DIR_SRC, '1111.wav')
    with open(file_path, "wb") as f:
        f.write(audio_content)

    logging.warning(f"File saved at: {file_path}")

    if random.randint(1, 2) == 1:
        text = 'Tell me your name.'
        id_audio = None
    else:
        text = None
        id_audio = str(uuid.uuid4())

    return DataTrainingResponse(
        id_tree=str(random.randint(1, 20)),  # id в дереве тем
        id_material=str(random.randint(1, 40)),  # id в материалах
        language_input='ru' if random.randint(1, 2) == 1 else 'en',  # какой раскладкой будем вводить в поле Input
        text=text,  # текст
        question=f'перевести на русский {random.randint(1, 20)}',  # вопрос
        id_audio=id_audio,
        answer_text = True if random.randint(1, 2) == 1 else False,  # ответ будет текстом или аудио
    )


@router.post("/answer-text")
async def answer_text(data: str = Form(...)) -> DataTrainingResponse:
    # Обработка текстового ответа

    # Обработка JSON данных
    json_data = json.loads(data)
    logging.debug(json_data)

    # для определения задание текстом или аудио
    if random.randint(1, 2) == 1:
        text = 'Tell me your name.'
        id_audio = None
    else:
        text = None
        id_audio = str(uuid.uuid4())

    # для определения задание текстом или аудио

    return DataTrainingResponse(
        id_tree=str(random.randint(1, 20)),  # id в дереве тем
        id_material=str(random.randint(1, 40)),  # id в материалах
        language_input='ru' if random.randint(1, 2) == 1 else 'en',  # какой раскладкой будем вводить в поле Input
        text=text,  # текст
        question=f'перевести на русский {random.randint(1, 20)}',  # вопрос
        id_audio=id_audio,
        answer_text=True if random.randint(1, 2) == 1 else False,  # ответ будет текстом или аудио
    )
