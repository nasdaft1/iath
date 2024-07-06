import json

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


def buffer_out(data_json: dict, id_index: str, buffer: dict, data_copy: dict = {}, marker=False):
    """
        Удаление файла или каталога
        :param data_json: Введенный json дерево
        :param id_index: Копируемый индекс
        :param buffer : Буфер json который вставляется в json
        :param data_copy : Буфер с данными копирования id-new:id-old
        :param marker : маркер вставки данных
        :return: словарь, представляющий структуру директорий и файлов
        """
    data_out_json = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder')
            index = value.get('#0#id')
            fun, data_copy = buffer_out(folder, id_index, buffer, data_copy, marker)
            if index == id_index:
                key_buffer = next(iter(buffer.keys()))  # получить первый ключ по правилам он единственный
                if fun.get(key_buffer):  # значит есть совпадение имен в элементе дерева
                    buffer[key_buffer + '-copy'] = buffer.pop(key_buffer)
                fun_buffer, data_copy = buffer_out(buffer, id_index, buffer, data_copy, True)
                fun.update(fun_buffer)
            data = {'#1#folder': fun if folder is not None else None,
                    '#4#id_copy' if marker else '#0#id': index,
                    }
            if marker:
                index_new = incrementer.increment()
                data['#0#id'] = index_new
                data_copy.update({index_new: index})
            data_out_json[key] = data
    return data_out_json, data_copy  # выполняется до найденного индекса


# def buffer_out_old(data_json: dict, id_index: str, buffer: dict, marker=False):
#     """
#         Удаление файла или каталога
#         :param data_json: Введенный json дерево
#         :param id_index: Копируемый индекс
#         :param buffer : буфер
#         :param marker : маркер вставки данных
#         :return: словарь, представляющий структуру директорий и файлов
#         """
#     data_out_json = {}
#     if isinstance(data_json, dict):
#         for key, value in data_json.items():
#             folder = value.get('#1#folder')
#             index = value.get('#0#id')
#             fun = buffer_out(folder, id_index, buffer, marker)
#             if index == id_index:
#                 fun_buffer = buffer_out(buffer, id_index, buffer, True)
#                 fun.update(fun_buffer)
#             data = {'#1#folder': fun if folder is not None else None,
#                     '#4#id_copy' if marker else '#0#id': index,
#                     }
#             if marker:
#                 data['#0#id'] = incrementer.increment()
#             # if index_copy := value.get('#1#id'):
#             #     data['#4#id_copy'] = index_copy
#             data_out_json[key] = data
#     return data_out_json  # выполняется до найденного индекса


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
