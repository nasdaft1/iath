import pprint

import orjson

from utils.func import incrementer


def buffer_in(data_json: dict, id_index: str):
    """
    Удаление файла или каталога
    :param data_json: Введенный json дерево
    :param id_index: Копируемый индекс
    :return: словарь, представляющий структуру директорий и файлов
    """
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder')
            index = value.get('#0#id')
            fun = buffer_in(folder, id_index)
            if fun:
                return fun  # выполняется после найденного индекса
            if index == id_index:
                return {key: {'#1#folder': folder, '#0#id': index}}  # выполняется когда нашелся индекс

    return {}  # выполняется до найденного индекса


def buffer_out(data_json: dict, id_index: str, buffer: dict,
               data_copy: dict = {}, marker=False, index_max=None):
    """
        Удаление файла или каталога
        :param data_json: Введенный json дерево
        :param id_index: Копируемый индекс
        :param buffer : Буфер json который вставляется в json
        :param data_copy : Буфер с данными копирования id-new:id-old
        :param marker : маркер вставки данных
        :param index_max: Максимальное значение индекса
        :return: словарь, представляющий структуру директорий и файлов
        """
    data_out_json = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder')
            index = value.get('#0#id')
            if max_id := value.get('#2#max_id'):
                index_max = max_id
                # if max_id < id_index:
                #     raise ValueError("Cannot be added to a label/file")

            fun, data_copy = buffer_out(folder, id_index, buffer, data_copy, marker, index_max)
            if index == id_index:
                # для замены
                key_buffer = next(iter(buffer.keys()))  # получить первый ключ по правилам он единственный
                if fun.get(key_buffer):  # значит есть совпадение имен в элементе дерева
                    buffer[key_buffer + '-copy'] = buffer.pop(key_buffer)
                fun_buffer, data_copy = buffer_out(buffer, id_index, buffer, data_copy, True, index_max)
                fun.update(fun_buffer)

            data = {'#1#folder': fun if folder is not None else None,
                    '#0#id': index}
            print(index_max)
            if marker:
                index_max += 1
                data['#0#id'] = index_max
                data_copy.update({index_max: index})
            if index == 0:
                data['#2#max_id'] = index_max
            data_out_json[key] = data
    return data_out_json, data_copy  # выполняется до найденного индекса


def delete_json(data_json: dict, index_del: int, found=False):
    """
    Удаление файла или каталога
    :param data_json: Введенный json дерево
    :param index_del: Удаляемый индекс
    :param found: Для найденного удаляемого файла индекс
    :return: словарь, представляющий структуру директорий и файлов
    """
    data_out_json = {}
    folder_next = False
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            if index == index_del:
                found = True
                continue
            if found:
                data = {'#1#folder': folder, '#0#id': index}
            else:
                fun, found = delete_json(folder, index_del, found)
                data = {'#1#folder': fun if folder is not None else None, '#0#id': index}
            data_out_json[key] = data
    return data_out_json, found


# def delete_json(data_json: dict, index_del: str):
#     """
#     Удаление файла или каталога
#     :param data_json: Введенный json дерево
#     :param index_del: Удаляемый индекс
#     :return: словарь, представляющий структуру директорий и файлов
#     """
#     data_out_json = {}
#     if isinstance(data_json, dict):
#         for key, value in data_json.items():
#             folder = value.setdefault('#1#folder', None)
#             index = value.setdefault('#0#id', None)
#             data = {'#1#folder': delete_json(folder, index_del) if folder is not None else None,
#                     '#0#id': index}
#             if max_id_get := value.get('#2#max_id', None):
#                 data['#2#max_id'] = max_id_get
#             if index_del != index:
#                 data_out_json[key] = data
#     return data_out_json


def rename_json(data_json: dict, id_index: int, name: str):
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

            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            data = {'#1#folder': rename_json(folder, id_index, name) if folder is not None else None,
                    '#0#id': index}
            # if max_id_get := value.setdefault('#2#max_id', None):
            #     data['#2#max_id'] = max_id_get
            data_out_json[key if id_index != index else name] = data
    return data_out_json


# def new_data_json(data_json: dict, id_index: str, name: str, type_data: dict | None, max_id=None | int):
#     """
#     Добавление каталога или файла в словарь json
#     :param data_json: Введенный json дерево
#     :param id_index: Индекс кому вставляем файл файла или каталога
#     :param name: Новое имя файла или каталога
#     :param type_data: {} - каталог None - файл
#
#     :param max_id: Максимальное значение id
#     :return: словарь, представляющий структуру директорий и файлов
#     """
#     data_out_json = {}
#     data_insert ={}
#     if isinstance(data_json, dict):
#
#         for key, value in data_json.items():
#             folder = value.setdefault('#1#folder', None)
#             index = value.setdefault('#0#id', None)
#             if max_id_get := value.setdefault('#2#max_id', None):
#                 max_id = max_id_get
#             data = {
#                 '#1#folder': new_data_json(folder, id_index, name, type_data, max_id) if folder is not None else None,
#                 '#0#id': index}
#             # присваивает новое значение если есть переменная
#
#             if index == id_index:
#                 data.get('#1#folder', {}).update({name: {'#1#folder': type_data, '#0#id': max_id}})
#                 max_id = max_id_get + 1
#             data_out_json[key] = data
#             if max_id_get == max_id:
#                 data['#2#max_id'] = str(int(max_id_get) + 1)
#
#                 data_insert = {'#2#max_id', data['#2#max_id']}
#             print(max_id, max_id_get)
#     return data_out_json


class DataJson:
    data: orjson

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
        try:
            self.data, data_buffer = buffer_out(self.data, id_parent,
                                                {name: {'#1#folder': None, '#0#id': '1'}})

        except AttributeError:
            raise ValueError("Cannot be added to a label/file")
        return self.data

    def new_folder(self, id_parent: str, name: str) -> dict:
        print(id_parent, name)
        try:
            self.data, data_buffer = buffer_out(self.data, id_parent,
                                                {name: {'#1#folder': {}, '#0#id': 'x'}})
        except AttributeError:
            raise ValueError("Cannot be added to a label/file")
        return self.data

    def rename(self, id_index: int, name: str) -> dict:
        index_max = self.data.get('root').get('#2#max_id')
        buffer = rename_json(self.data, id_index, name)
        buffer['root']['#2#max_id'] = index_max
        self.data = buffer
        return self.data

    def delete(self, id_index: int) -> dict:
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = delete_json(self.data, id_index)
        buffer['root']['#2#max_id'] = index_max
        self.data = buffer
        return self.data


tree = DataJson()
