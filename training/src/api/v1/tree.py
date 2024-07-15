import logging
import pprint
import orjson

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
    return tree.get()
    #return tree.insert(id_old, id_parent)


@router.post("/new_label")
async def new_label(data: ApiNewLabel):
    logging.info(f'data = {data}')
    #return tree.new_label(id_parent, name)
    return tree.get()


@router.post("/new_folder")
async def new_folder(data: ApiNewFolder):
    logging.info(f'data = {data}')
    # return tree.new_folder(id_parent, name)
    return tree.get()


@router.post("/rename")
async def rename(data: ApiRename):
    logging.info(f'data = {data}')
    # return tree.rename(id_index, name)
    return tree.get()


@router.delete("/del")
async def delete_index(data: ApiDel):
    logging.debug(f'data = {data}')
    # json_data = await request.json()
    # data_dict = orjson.loads(orjson.dumps(json_data))
    # pprint.pprint(data_dict)
    # await tree.delete(id_index)
    # pprint.pprint(tree.get())

    return tree.get()
