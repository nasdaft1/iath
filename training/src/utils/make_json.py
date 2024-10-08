import os
import json

from utils.work_tree import tree
from utils.func import incrementer



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
        return {'root': {'#0#id': 0,
                         '#1#folder': directory_dict,
                         '#2#max_id': incrementer.increment()}}
    return directory_dict


def load_tree_dir(directory: str) -> None:
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

def load_tree_file(file_path: str) -> None:
    """
    Преобразование структуры директорий в словарь и запись в файл.
    :param directory: Результат json дерева после обработки
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        print("Структура директорий сохранена в файл directory_structure.json")
        tree.set(data)
