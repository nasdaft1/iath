from pydantic import BaseModel
from typing import Any


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


class DataMaterialResponse(BaseModel):
    data: list
    status_code: int
    status_name: str
    id_max: int | None



