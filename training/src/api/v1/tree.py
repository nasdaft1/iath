import logging

from fastapi import APIRouter, Request
from utils.work_tree import tree
from models.base import ApiDel, ApiRename, ApiInsert, \
    ApiNewLabel, ApiNewFolder, DataResponse

router = APIRouter()


@router.get("/theme")  # получение списка каталога и фалов
async def theme(request: Request) -> DataResponse:
    logging.info('/api/theme')
    data = tree.get()
    return DataResponse(
            data=data,
            status_code=200,
            status_name='Ok',
            id_add=30)


@router.get("/search")
async def search(request: Request,
                 name: str):
    logging.info('/api/search -> name=%name')
    return tree.search(name)


@router.post("/insert")
async def insert(data: ApiInsert) -> DataResponse:
    logging.info(f'data = {data}')
    print('id_path_copy=', data.id_path_copy, 'id_path_insert=', data.id_path_insert)
    data = tree.copy_insert_data(data.id_path_copy, data.id_path_insert)
    return DataResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=30)


@router.post("/new_label")
async def new_label(data: ApiNewLabel) -> DataResponse:
    logging.info(f'data = {data}')
    # return tree.new_label(id_parent, name)
    print('id_path=', data.id_path, 'name=', data.name)
    data = tree.new_label(data.id_path, data.name)
    return DataResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=30)

@router.post("/new_folder")
async def new_folder(data: ApiNewFolder) -> DataResponse:
    logging.info(f'data = {data}')
    print('id_path=', data.id_path, 'name=', data.name)
    data = tree.new_folder(data.id_path, data.name)
    return DataResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=30)


@router.post("/rename")
async def rename(data: ApiRename) -> DataResponse:
    print('id_path=', data.id_path, 'name=', data.name)
    data = tree.rename(data.id_path, data.name)
    return DataResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=30)


@router.delete("/del")
async def delete_index(data: ApiDel) -> DataResponse:
    print('id_path=', data.id_path)
    data = tree.delete(data.id_path)
    return DataResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=30)
