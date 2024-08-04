import logging

from utils.material_json import make_json

from fastapi import APIRouter, Request
from utils.work_tree import tree
from models.base import DataMaterialResponse, DataMaterialLoad

router = APIRouter()


@router.post("/read")  # получение списка каталога и фалов
async def read_material(data_table: DataMaterialLoad) -> DataMaterialResponse:
    logging.info(data_table)
    print(data_table)
    logging.info('/read')
    return DataMaterialResponse(
        data=make_json(),
        status_code=200,
        status_name='Ok')


@router.post("/write")  # получение списка каталога и фалов
async def write_material(request: Request) -> DataMaterialResponse:
    logging.info('/write')
    data = tree.get()
    return DataMaterialResponse(
        data=data,
        status_code=200,
        status_name='Ok',
        id_add=None)
