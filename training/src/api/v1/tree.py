import logging

from fastapi import APIRouter, Request
from utils.work_tree import tree
from models.base import ApiDel, ApiRename, ApiInsert, ApiNewLabel, ApiNewFolder

router = APIRouter()


@router.get("/theme")  # получение списка каталога и фалов
async def theme(request: Request):
    logging.info('/api/theme')
    return tree.get()


@router.get("/search")
async def search(request: Request,
                 name: str):
    logging.info('/api/search -> name=%name')
    return tree.search(name)


@router.post("/insert")
async def insert(data: ApiInsert):
    logging.info(f'data = {data}')
    print('id_path_copy=', data.id_path_copy, 'id_path_insert=', data.id_path_insert)
    return tree.copy_insert_data(data.id_path_copy, data.id_path_insert)


@router.post("/new_label")
async def new_label(data: ApiNewLabel):
    logging.info(f'data = {data}')
    # return tree.new_label(id_parent, name)
    print('id_path=', data.id_path, 'name=', data.name)
    return tree.new_label(data.id_path, data.name)


@router.post("/new_folder")
async def new_folder(data: ApiNewFolder):
    logging.info(f'data = {data}')
    print('id_path=', data.id_path, 'name=', data.name)
    return tree.new_folder(data.id_path, data.name)


@router.post("/rename")
async def rename(data: ApiRename):
    print('id_path=', data.id_path, 'name=', data.name)
    return tree.rename(data.id_path, data.name)


@router.delete("/del")
async def delete_index(data: ApiDel):
    print('id_path=', data.id_path)
    return tree.delete(data.id_path)
