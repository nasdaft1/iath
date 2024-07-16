import pprint

import orjson


def buffer_copy(data_json: dict, id_index: list, level: int = 0, found=False):
    """
    Удаление файла или каталога
    :param data_json: Введенный json дерево
    :param id_index: Копируемый индекс
    :param level: глубина рекурсивной функции
    :param found: Для найденного индекс
    :return: словарь, представляющий структуру директорий и файлов
    """
    index_level = id_index[level]
    fun = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder')
            index = value.get('#0#id')
            if index_level == index:
                if id_index[level + 1] is not None:
                    fun, found = buffer_copy(folder, id_index, level + 1, found)
                else:
                    return {key: value}, True
            if found is True:
                return fun, found


def buffer_indexation(data_json: dict, id_start: int, found=[], max_index=0):
    """
    Установка новых индексов в буфере
    :param data_json: Введенный json дерево
    :param id_start: Начальное значение индекса
    :param found: Список замененных индексов !!! обязательно указать [] в аргументах
    :param max_index: Последнее значение индекса
    :return: словарь, представляющий структуру директорий и файлов, True если выполнено действие
    """
    data_out_json = {}
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            id_start += 1
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            fun, found, max_index = buffer_indexation(folder, id_start, found, id_start)
            data_out_json[key] = {'#1#folder': fun if folder is not None else None, '#0#id': id_start}
            found.append([index, id_start])
    return data_out_json, found, max_index


def buffer_insert(data_json: dict, insert_index: list, name: str, buffer: dict, level: int = 0, found=False):
    """
        Удаление файла или каталога
        :param data_json: Введенный json дерево
        :param insert_index: Список пути индексов для копирования
        :param name: Имя каталога
        :param buffer : Буфер json который вставляется в json
        :param level: глубина рекурсивной функции
        :param found: Для найденного вставляемого файла индекс
        :return: словарь, представляющий структуру директорий и файлов
        """
    data_out_json = {}
    index_level = insert_index[level]
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
            if index_level == index:
                if folder is None:  # добавление производится в файл, а не папку
                    raise ValueError('Cannot be added to a label/file')
                fun, found = buffer_insert(folder, insert_index, name, buffer, level + 1, found)
                data_out_json[key] = {'#1#folder': fun if folder is not None else None, '#0#id': index}
            else:
                data_out_json[key] = {'#1#folder': folder, '#0#id': index}
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
    :param found: Для найденного индекс
    :return: словарь, представляющий структуру директорий и файлов, True если выполнено действие
    """
    data_out_json = {}
    index_level = rename_index[level]
    if isinstance(data_json, dict):
        for key, value in data_json.items():
            folder = value.get('#1#folder', None)
            index = value.get('#0#id', None)
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

    def update_data(self, buffer: dict, index_max: int, action: bool, increment=0):
        if action is False:
            raise IndexError('Action failed')
        self.data = buffer
        self.data['root']['#2#max_id'] = index_max + increment
        return self.data

    def copy_insert_data(self, copy_indexes: list, insert_indexes: list):
        copy_indexes.append(None)
        insert_indexes.append(None)
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = buffer_copy(self.data, copy_indexes)
        buffer, rename_index, index_max = buffer_indexation(buffer, index_max, [])
        key, value = next(iter(buffer.items()))
        buffer, action = buffer_insert(self.data, insert_indexes, key, value)
        # return self.update_data(buffer, index_max, action, 0),rename_index
        return self.update_data(buffer, index_max, action, 0), rename_index

    def buffer_copy(self, id_indexes: list) -> dict:
        id_indexes.append(None)
        buffer, action = buffer_copy(self.data, id_indexes)
        self.data = buffer
        return self.data

    def new_label(self, id_parent: list, name: str) -> dict:
        id_parent.append(None)
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = buffer_insert(
            self.data, id_parent, name, {'#1#folder': None, '#0#id': index_max + 1})
        return self.update_data(buffer, index_max, action, 1)

    def new_folder(self, id_parent: list, name: str) -> dict:
        id_parent.append(None)
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = buffer_insert(
            self.data, id_parent, name, {'#1#folder': {}, '#0#id': index_max + 1})
        return self.update_data(buffer, index_max, action, 1)

    def rename(self, id_indexes: list, name: str) -> dict:
        """
        Переименование из json
        :param id_indexes: Список индекса дерева json
        :param name: Новое имя файла или папки
        :return: словарь, представляющий структуру директорий и файлов
        """
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = rename_json(self.data, id_indexes, name)
        return self.update_data(buffer, index_max, action)

    def delete(self, id_indexes: list) -> dict:
        """
        Удаление из json
        :param id_indexes: Список индекса дерева json
        :return: словарь, представляющий структуру директорий и файлов
        """
        index_max = self.data.get('root').get('#2#max_id')
        buffer, action = delete_json(self.data, id_indexes)
        return self.update_data(buffer, index_max, action)


tree = DataJson()
