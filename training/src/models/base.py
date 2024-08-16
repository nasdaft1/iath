from pydantic import BaseModel
from typing import Any, Optional


class ApiPath(BaseModel):
    id_path: list[int]


class ApiName(BaseModel):
    name: str


class ApiDel(ApiPath):
    pass


class ApiRename(ApiPath, ApiName):
    pass


class ApiNewFolder(ApiPath, ApiName):
    pass


class ApiNewLabel(ApiPath, ApiName):
    pass


class ApiInsert(BaseModel):
    id_path_copy: list[int]
    id_path_insert: list[int]


class DataResponse(BaseModel):
    data: dict
    status_code: int
    status_name: str
    id_add: int | None


class DataCell(BaseModel):
    id_audio: str | None
    text_content: str


class DataCellLoad(DataCell):
    change: bool
    removal: Any  # если ячейку надо удалить


class DataMaterialResponse(BaseModel):
    data: list[list[DataCell]]
    status_code: int
    status_name: str


class DataMaterialLoad(BaseModel):
    data: list[list[DataCellLoad]] | None
    id: int | str | None


class DataTraining(BaseModel):
    id_question: str  # id вопроса
    type_lang: str  # тип вопроса и ответа
    id_file: str  # id файла


class DataTrainingResponse(DataTraining):
    text: str | None  # текст
    question: str  # вопрос
    id_audio: str | None  # id файла аудио
