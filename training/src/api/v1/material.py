import logging
import pprint

from fastapi import APIRouter, Request

from models.base import DataMaterialResponse, DataMaterialLoad
from utils.material_json import make_json

router = APIRouter()


@router.post("/read")  # получение списка каталога и фалов
# async def read_material(data_table: DataMaterialLoad) -> DataMaterialResponse:
async def read_material(data_table: DataMaterialLoad) -> DataMaterialResponse:
    logging.info(data_table)
    pprint.pprint(data_table)

    logging.info('/read')
    return DataMaterialResponse(
        data=make_json(),
        status_code=200,
        status_name='Ok')


@router.post("/write")  # получение списка каталога и фалов
async def write_material(request: Request) -> DataMaterialResponse:
    logging.info('/read')
    return DataMaterialResponse(
        data=make_json(),
        status_code=200,
        status_name='Ok')
