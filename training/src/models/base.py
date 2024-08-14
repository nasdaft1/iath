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


class DataTrainingResponse(BaseModel):
    audiotext # аудио текст
    text_in_writing # текст для вопроса
    question # вопрос текст
    answer_in_writing # ответ текст

    id: int | str | None
