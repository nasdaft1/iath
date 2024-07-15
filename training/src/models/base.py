from pydantic import BaseModel


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
