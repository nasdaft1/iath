import logging
from typing import Any, Generator, BinaryIO

from models.base import DataTraining, DataTrainingResponse
from core.config import BASE_DIR_SRC

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse

router = APIRouter()


# Открытие файла и загрузка его в переменную


@router.get("/question-answer")  # получение списка каталога и фалов
async def text_text(data: DataTraining) -> DataTrainingResponse:
    logging.debug(data)
    file_path = BASE_DIR_SRC + '\\EF4e_Elementary_SB_1.10.mp3'  # укажите путь к вашему аудиофайлу
    logging.warning(file_path)
    return DataTrainingResponse(
        id_question='',
        type_lang='',
        id_file='',
        text='',
        id_text='',
        question=''
    )



