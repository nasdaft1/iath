import logging

from utils.material_json import make_json

from fastapi import APIRouter, Request
from utils.work_tree import tree
from models.base import DataMaterialResponse

router = APIRouter()


@router.post("/read")  # получение списка каталога и фалов
async def theme(request: Request) -> DataMaterialResponse:
    logging.info('/read')
    data = make_json
    return DataMaterialResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=None)


@router.post("/write")  # получение списка каталога и фалов
async def theme(request: Request) -> DataMaterialResponse:
    logging.info('/write')
    data = tree.get()
    return DataMaterialResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=None)
