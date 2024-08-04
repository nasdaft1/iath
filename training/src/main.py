import pprint

import uvicorn
from utils.work_tree import tree as tree_work
from utils.make_json import load_tree_file
from core.config import BASE_DIR_SRC

from fastapi import FastAPI  # , Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from fastapi_pagination import add_pagination
from api.v1 import tree, audio, material

# from pydantic import BaseModel

app = FastAPI(
    # title='ShorterLinks API',
    docs_url='/api/openapi', # http://213.178.34.212:18000/api/openapi
    openapi_url='/api/openapi.json',
    default_response_class=ORJSONResponse,
)

app.include_router(tree.router, prefix='/api/v1/tree')
app.include_router(audio.router, prefix='/api/v1')
app.include_router(material.router, prefix='/api/v1/material')

add_pagination(app)

origins = ["*"]  # для обхода cops браузера даже html запущенного с жесткого диска

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Позволяет отправлять запросы с этих доменов
    allow_credentials=True,
    allow_methods=["*"],  # Позволяет использовать любые методы (GET, POST и т.д.)
    allow_headers=["*"],  # Позволяет использовать любые заголовки
)

if __name__ == '__main__':
    # uvicorn.run("main:app", host="127.0.0.1", port=8000)
    load_tree_file(BASE_DIR_SRC+'\\directory_structure.json')
    uvicorn.run(app, host="192.168.1.81", port=8000)
    #http://213.178.34.212:18000/api/openapi
