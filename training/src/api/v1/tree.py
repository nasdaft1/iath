import logging
import pprint

from fastapi import APIRouter
from utils.work_tree import tree

router = APIRouter()


@router.get("/theme")  # получение списка каталога и фалов
# @app.get("/api/theme", response_model=Data)
async def theme(
        # request: Request
):
    logging.info('/api/theme')
    return tree.get()


@router.get("/search")
async def search(  # request: Request,
        name: str):
    logging.info('/api/search -> name=%name')
    return tree.search(name)


@router.post("/insert")
async def insert(  # request: Request,
        id_old: str,
        id_parent: str):
    logging.info('/api/insert -> id_old=%id_old id_parent=%id_parent')
    return tree.insert(id_old, id_parent)


@router.post("/new_label")
async def new_label(  # request: Request,
        id_parent: str,
        name: str):
    logging.info('/api/new_label -> id_parent=%id_parent name=%name')
    return tree.new_label(id_parent, name)


@router.post("/new_folder")
async def new_folder(  # request: Request,
        id_parent: str,
        name: str):
    logging.info('/api/new_folder -> id_parent=%id_parent name=%name')
    return tree.new_folder(id_parent, name)


@router.post("/rename")
async def rename(  # request: Request,
        id_index: str,
        name: str):
    logging.info('/api/rename -> id_index=%id_index name=%name')
    return tree.rename(id_index, name)


@router.delete("/del")
# @app.get("/api/theme", response_model=Data)
async def delete_index(  # request: Request,
        id_index: str):
    logging.info('/api/del -> id_index=%id_index')
    tree.delete(id_index)
    pprint.pprint(tree.get())
    return tree.get()
