import pprint

import orjson


def buffer_copy(data_json: dict, id_index: str):
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
            fun = buffer_copy(folder, id_index)
            if fun:
                return fun  # выполняется после найденного индекса
            if index == id_index:
                return {key: {'#1#folder': folder, '#0#id': index}}  # выполняется когда нашелся индекс

    return {}  # выполняется до найденного индекса


def buffer_insert(data_json: dict, insert_index: list, name: str, buffer: dict, level: int = 0, found=False):
    """
        Удаление файла или каталога
        :param data_json: Введенный json дерево
        :param insert_index: Список пути индексов для копирования
        :param buffer : Буфер json который вставляется в json
        :param level: глубина рекурсивной функции
        :param found: Для найденного удаляемого файла индекс
        :return: словарь, представляющий структуру директорий и файлов
        """
    data_out_json = {}
    index_level = insert_index[level]
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            print('->',folder)
            index = value.get('#0#id', None)
            if index_level == index:
                fun, found = buffer_insert(folder, insert_index, name, buffer, level + 1, found)
                data_out_json[key] = {'#1#folder': fun if folder is not None else None, '#0#id': index}
            else:
                data_out_json[key] = {'#1#folder': folder, '#0#id': index}
    print(level, index_level ,data_out_json)
    if index_level is None:
        data_out_json[name + '-copy' if data_out_json.get(name) else name] = buffer
        found = True
    return data_out_json, found


def delete_json(data_json: dict, index_del: list, level: int = 0, found=False):
    """
    Удаление файла или каталога
    :param data_json: Введенный json дерево
    :param index_del: Список пути индексов для удаления удаляемых
    :param level: глубина рекурсивной функции
    :param found: Для найденного удаляемого файла индекс
    :return: словарь, представляющий структуру директорий и файлов, True если выполнено действие
    """
    data_out_json = {}
    index_level = index_del[level]
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            # index_level = index_del[level]
            if index_level == index:
                if index_level == index_del[-1]:
                    found = True
                    continue
                else:
                    fun, found = delete_json(folder, index_del, level + 1, found)
                    data_out_json[key] = {'#1#folder': fun if folder is not None else None, '#0#id': index}
            else:
                data_out_json[key] = {'#1#folder': folder, '#0#id': index}
    return data_out_json, found


def rename_json(data_json: dict, rename_index: list, name: str, level: int = 0, found=False):
    """
    Переименование файла или каталога
    :param data_json: Введенный json дерево
    :param rename_index: Список индексов у заменяемого файла или каталога
    :param name: Новое имя файла или каталога
    :param level: глубина рекурсивной функции
    :return: словарь, представляющий структуру директорий и файлов, True если выполнено действие
    """
    data_out_json = {}
    index_level = rename_index[level]
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            # index_level = rename_index[level]
            if index_level == index:
                if index_level == rename_index[-1]:
                    found = True
                    data_out_json[name] = {'#1#folder': folder, '#0#id': index}
                else:
                    fun, found = rename_json(folder, rename_index, name, level + 1, found)
                    data_out_json[key] = {'#1#folder': fun if folder is not None else None, '#0#id': index}
            else:
                data_out_json[key] = {'#1#folder': folder, '#0#id': index}
    return data_out_json, found


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

    def new_label(self, id_parent: list, name: str) -> dict:
        print(id_parent, name)
        try:
            id_parent.append(None)
            index_max = self.data.get('root').get('#2#max_id')
            buffer, action = buffer_insert(
                self.data, id_parent, name, {'#1#folder': None, '#0#id': index_max + 1})
            buffer['root']['#2#max_id'] = index_max + 1 if action else index_max
        except AttributeError:
            raise ValueError("Cannot be added to a label/file")
        return self.data

    def new_folder(self, id_parent: list, name: str) -> dict:
        print(id_parent, name)
        try:
            id_parent.append(None)
            index_max = self.data.get('root').get('#2#max_id')
            buffer, action = buffer_insert(
                self.data, id_parent, name, {'#1#folder': {}, '#0#id': index_max + 1})
            buffer['root']['#2#max_id'] = index_max + 1
            self.data = buffer
            print(id_parent,action)
        except AttributeError:
            raise ValueError("Cannot be added to a label/file")
        return self.data

    def rename(self, id_indexes: list, name: str) -> dict:
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = rename_json(self.data, id_indexes, name)
        buffer['root']['#2#max_id'] = index_max
        self.data = buffer
        return self.data

    def delete(self, id_indexes: list) -> dict:
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = delete_json(self.data, id_indexes)
        buffer['root']['#2#max_id'] = index_max
        self.data = buffer
        return self.data


tree = DataJson()
