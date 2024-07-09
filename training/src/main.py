import pprint

import uvicorn
from utils.work_tree import tree as tree_work
from utils.make_json import load_tree

from fastapi import FastAPI  # , Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from fastapi_pagination import add_pagination
from api.v1 import tree

# from pydantic import BaseModel

app = FastAPI(
    # title='ShorterLinks API',
    docs_url='/api/openapi', # http://213.178.34.212:18000/api/openapi
    openapi_url='/api/openapi.json',
    default_response_class=ORJSONResponse,
)

app.include_router(tree.router, prefix='/api/v1/tree')

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
    #load_tree('d:\\12')
    #pprint.pprint(tree_work.get())
    uvicorn.run(app, host="192.168.1.81", port=8000)

    # main('d:\\12')  # Замените на путь к нужной директории
    # print('-' * 120)
    # # y = tree.get()
    # # pprint.pprint(y)
    #
    # print('-' * 120)
    # # tree.delete('47')
    # # tree.rename('21', 'xxxx')
    # pprint.pprint(tree.get())
    # print('-' * 120)
    # # tree.new_folder('30', 'dddd')
    # # tree.new_label('30', 'd333')
    # # tree.new_label('folder_root', 'd333')
    # # tree.delete('46')
    # # tree.new_folder('30', 'yyyy')
    # x = tree.get()
    # y = buffer_in(x, '45')
    # pprint.pprint(y)
    # z = buffer_out(x, '22', y)
    #
    # print('-' * 120)
    # pprint.pprint(z)
    #
    # # pprint.pprint(tree.get())
    # # if z == y:
    # #     print('равны словари')
    # # else:
    # #     print('словари разные')
    #
    # # pprint.pprint(tree.get())
