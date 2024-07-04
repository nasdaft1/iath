import json
import logging
import os
import pprint

import uvicorn
from fastapi import FastAPI  # , Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

# from pydantic import BaseModel

app = FastAPI(
    # title='ShorterLinks API',
    docs_url='/api/openapi',
    # openapi_url='/api/openapi.json',
    default_response_class=ORJSONResponse,
)

origins = ["*"]  # для обхода cops браузера даже html запущенного с жесткого диска

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Позволяет отправлять запросы с этих доменов
    allow_credentials=True,
    allow_methods=["*"],  # Позволяет использовать любые методы (GET, POST и т.д.)
    allow_headers=["*"],  # Позволяет использовать любые заголовки
)


class Incrementer:
    def __init__(self, start_id):
        # Инициализация начального значения
        self.value = start_id

    def increment(self):
        # Увеличение значения на 1
        self.value += 1
        return str(self.value)


incrementer = Incrementer(20)


def dir_to_dict(path: str, depth: int):
    """
    Формирование json из файлов и каталогов в папке
    :param path: Путь к каталогу
    :param depth: Глубина каталога
    :return: словарь, представляющий структуру директорий и файлов
    """
    directory_dict = {}

    # Перебор всех элементов в текущем каталоге
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        directory_dict[item] = {
            "#0#id": incrementer.increment(),
            '#1#folder': dir_to_dict(item_path, depth + 1) if os.path.isdir(item_path) else None}
    if depth == 0:
        return {'root': {'#0#id': 'folder_root',
                         '#1#folder': directory_dict,
                         '#2#max_id': str(incrementer.increment())}}
    return directory_dict


def delete_json(data_json: dict, index_del: str):
    """
    Удаление файла или каталога
    :param data_json: Введенный json дерево
    :param index_del: Удаляемый индекс
    :return: словарь, представляющий структуру директорий и файлов
    """
    data_out_json = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.setdefault('#1#folder', None)
            index = value.setdefault('#0#id', None)
            data = {'#1#folder': delete_json(folder, index_del) if folder is not None else None,
                    '#0#id': index}
            if max_id_get := value.setdefault('#2#max_id', None):
                data['#2#max_id'] = max_id_get
            if index_del != index:
                data_out_json[key] = data
    return data_out_json


def rename_json(data_json: dict, id_index: str, name: str):
    """
    Переименование файла или каталога
    :param data_json: Введенный json дерево
    :param id_index: Индекс у заменяемого файла или каталога
    :param name: Новое имя файла или каталога
    :return: словарь, представляющий структуру директорий и файлов
    """
    data_out_json = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.setdefault('#1#folder', None)
            index = value.setdefault('#0#id', None)
            data = {'#1#folder': rename_json(folder, id_index, name) if folder is not None else None,
                    '#0#id': index}
            if max_id_get := value.setdefault('#2#max_id', None):
                data['#2#max_id'] = max_id_get
            data_out_json[key if id_index != index else name] = data
    return data_out_json


def new_data_json(data_json: dict, id_index: str, name: str, type_data: dict | None, max_id=None | int):
    """
    Добавление каталога или файла в словарь json
    :param data_json: Введенный json дерево
    :param id_index: Индекс кому вставляем файл файла или каталога
    :param name: Новое имя файла или каталога
    :param type_data: {} - каталог None - файл

    :param max_id: Максимальное значение id
    :return: словарь, представляющий структуру директорий и файлов
    """
    data_out_json = {}
    if isinstance(data_json, dict):

        for key, value in data_json.items():
            folder = value.setdefault('#1#folder', None)
            index = value.setdefault('#0#id', None)
            if max_id_get := value.setdefault('#2#max_id', None):
                max_id = max_id_get
            data = {
                '#1#folder': new_data_json(folder, id_index, name, type_data, max_id) if folder is not None else None,
                '#0#id': index}
            # присваивает новое значение если есть переменная
            data['#2#max_id'] = str(int(max_id_get) + 1) if max_id_get else data.get('#2#max_id', None)
            if index == id_index:
                data.get('#1#folder', {}).update({name: {'#1#folder': type_data, '#0#id': max_id}})
            data_out_json[key] = data

    return data_out_json


class DataJson:
    data: json

    def get(self) -> dict:
        return self.data

    def set(self, data_json: dict) -> None:
        # Увеличение значения на 1
        self.data = data_json

    def search(self, name: str) -> dict:
        print(name)
        return self.data

    def insert(self, id_old: str, id_parent: str) -> dict:
        print(id_old, id_parent)
        return self.data

    def new_label(self, id_parent: str, name: str) -> dict:
        print(id_parent, name)
        self.data = new_data_json(self.data, id_parent, name, None)
        return self.data

    def new_folder(self, id_parent: str, name: str) -> dict:
        print(id_parent, name)
        self.data = new_data_json(self.data, id_parent, name, {})
        return self.data

    def rename(self, id_index: str, name: str) -> dict:
        self.data = rename_json(self.data, id_index, name)
        return self.data

    def delete(self, id_index: str) -> dict:
        self.data = delete_json(self.data, id_index)
        return self.data


tree = DataJson()


def main(directory: str) -> None:
    """
    Преобразование структуры директорий в словарь и запись в файл.
    :param directory: Результат json дерева после обработки
    """
    # Получение структуры директорий
    dir_structure = dir_to_dict(directory, 0)
    # Преобразование структуры директорий в JSON строку
    json_structure = json.dumps(dir_structure, indent=4)
    # Запись JSON строки в файл
    with open('directory_structure.json', 'w') as json_file:
        json_file.write(json_structure)
    print("Структура директорий сохранена в файл directory_structure.json")
    tree.set(dir_structure)


# Пример использования


@app.get("/api/theme")  # получение списка каталога и фалов
# @app.get("/api/theme", response_model=Data)
async def theme(
        # request: Request
):
    logging.info('/api/theme')
    return tree.get()


@app.get("/api/search")
async def search(  # request: Request,
        name: str):
    logging.info('/api/search -> name=%name')
    return tree.search(name)


@app.post("/api/insert")
async def insert(  # request: Request,
        id_old: str,
        id_parent: str):
    logging.info('/api/insert -> id_old=%id_old id_parent=%id_parent')
    return tree.insert(id_old, id_parent)


@app.post("/api/new_label")
async def new_label(  # request: Request,
        id_parent: str,
        name: str):
    logging.info('/api/new_label -> id_parent=%id_parent name=%name')
    return tree.new_label(id_parent, name)


@app.post("/api/new_folder")
async def new_folder(  # request: Request,
        id_parent: str,
        name: str):
    logging.info('/api/new_folder -> id_parent=%id_parent name=%name')
    return tree.new_folder(id_parent, name)


@app.post("/api/rename")
async def rename(  # request: Request,
        id_index: str,
        name: str):
    logging.info('/api/rename -> id_index=%id_index name=%name')
    return tree.rename(id_index, name)


@app.delete("/api/del")
# @app.get("/api/theme", response_model=Data)
async def delete_index(  # request: Request,
        id_index: str):
    logging.info('/api/del -> id_index=%id_index')
    tree.delete(id_index)
    pprint.pprint(tree.get())
    return tree.get()


if __name__ == '__main__':
    main('d:\\12')  # Замените на путь к нужной директории
    print('-' * 120)
    # y = tree.get()
    # pprint.pprint(y)

    print('-' * 120)
    # tree.delete('47')
    tree.rename('21', 'xxxx')
    pprint.pprint(tree.get())
    print('-' * 120)
    tree.new_folder('30', 'dddd')
    tree.new_label('30', 'd333')
    tree.new_label('folder_root', 'd333')
    tree.delete('46')
    # tree.new_folder('30', 'yyyy')
    pprint.pprint(tree.get())

    # pprint.pprint(tree.get())
    # if z == y:
    #     print('равны словари')
    # else:
    #     print('словари разные')

    # pprint.pprint(tree.get())
    # uvicorn.run("main:app", host="127.0.0.1", port=8000)
    uvicorn.run(app, host="192.168.1.81", port=8000)
