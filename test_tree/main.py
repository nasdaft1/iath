import json
import os
import uuid

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import ORJSONResponse

app = FastAPI(
    # title='ShorterLinks API',
    docs_url='/api/openapi',
    # openapi_url='/api/openapi.json',
    default_response_class=ORJSONResponse,
)

origins = ["*"]  # для обхода cops браузера даже html запущенного с жеского диска

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Позволяет отправлять запросы с этих доменов
    allow_credentials=True,
    allow_methods=["*"],  # Позволяет использовать любые методы (GET, POST и т.д.)
    allow_headers=["*"],  # Позволяет использовать любые заголовки
)


# Определение модели данных с помощью Pydantic
class Data(BaseModel):
    message: str
    status: str


class Incrementer:
    def __init__(self):
        # Инициализация начального значения
        self.value = 20

    def increment(self):
        # Увеличение значения на 1
        self.value += 1
        return self.value


class DataJson:
    data: json

    def get(self):
        return self.data

    def set(self, data_json):
        # Увеличение значения на 1
        self.data = data_json


tree = DataJson()


def dir_to_dict1(path, incrementer, parent, depth):
    """
    Преобразование структуры директорий в словарь.
    :param path: путь к директории
    :return: словарь, представляющий структуру директорий и файлов
    """
    directory_dict = {}
    # Перебор всех элементов в текущем каталоге
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        id = incrementer.increment()
        # print(id)  # Вывод: 1
        # Если элемент является директорией, рекурсивно вызываем dir_to_dict
        if os.path.isdir(item_path):
            directory_dict[item] = {"#0#id": id,
                                    '#1#folder': dir_to_dict1(item_path, incrementer, id, depth + 1)}
        else:
            # Если элемент является файлом, добавляем его в словарь
            # Создание случайного UUID
            random_uuid = str(uuid.uuid4())
            # print(random_uuid)
            directory_dict[item] = {"#0#id": id}
    tree.set(directory_dict)
    return directory_dict


def main(directory):
    incrementer = Incrementer()
    # Получение структуры директорий
    dir_structure = dir_to_dict1(directory, incrementer, None, 0)

    # Преобразование структуры директорий в JSON строку
    json_structure = json.dumps(dir_structure, indent=4)

    # Запись JSON строки в файл
    with open('directory_structure.json', 'w') as json_file:
        json_file.write(json_structure)

    print("Структура директорий сохранена в файл directory_structure.json")

    return dir_structure


# Пример использования


@app.get("/api/theme")  # получение списка каталога и фалов
# @app.get("/api/theme", response_model=Data)
async def theme(request: Request):
    return main('d:\\12')


@app.get("/api/search")
async def search(request: Request,
                 name: str):
    print('name=', name)
    return main('d:\\12')


@app.post("/api/insert")
async def insert(request: Request,
                 id_old: str,
                 id_parent: str):
    print('id_old=', id_old)
    print('id_parent=', id_parent)
    return main('d:\\12')


@app.post("/api/new_label")
async def new_label(request: Request,
                    id_parent: str,
                    name: str):
    print('id=', id_parent)
    print('name=', name)
    return main('d:\\12')


@app.post("/api/new_folder")
async def new_folder(request: Request,
                     id_parent: str,
                     name: str):
    print('id=', id_parent)
    print('name=', name)
    return main('d:\\12')


@app.post("/api/rename")
async def new_folder(request: Request,
                     id_index: str,
                     name: str):
    print('id=', id_index)
    print('new_name=', name)
    return main('d:\\12')


@app.delete("/api/del")
# @app.get("/api/theme", response_model=Data)
async def new_folder(request: Request,
                     id_index: str):
    print('delete id=', id_index)
    return main('d:\\12')


if __name__ == '__main__':
    directory = 'd:\\12'  # Замените на путь к нужной директории
    main(directory)

    # uvicorn.run("main:app", host="127.0.0.1", port=8000)
    uvicorn.run(app, host="192.168.1.81", port=8000)
