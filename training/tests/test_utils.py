import pytest
import pprint

from utils.work_tree import *
from data_json import *

# Путь к вашему JSON файлу
file_path = 'data.json'

tree.set(start_data_json)
# Печать содержимого JSON файла
pprint.pprint(tree.get())


@pytest.mark.parametrize("index, data, expected_exception", [
    ([0, 21], delete_21_data_json, None),
    ([0, 21, 22, 26, 27], delete_27_data_json, None),  # No exception expected
    ([0, 52], delete_52_data_json, None)
])
def test_delete(index, data, expected_exception):
    # tree.set(start_data_json)
    # assert tree.delete(index) == data
    pass


@pytest.mark.parametrize("index, name, data, expected_exception", [
    ([0, 52], 'xxxx.txt', rename_52_data_json, None),
    ([0, 21], 'wwww', rename_21_data_json, None),  # No exception expected
    ([0, 36, 45, 46, 47, 48], 'hhhh', rename_48_data_json, None),  # No exception expected
    # ('152', delete_52_data_json , None)
])
def test_rename(index, name, data, expected_exception):
    tree.set(start_data_json)
    assert tree.rename(index, name) == data


@pytest.mark.parametrize("index, name, data, expected_exception, text_error", [
    ([0], 'www', new_label_0_root_data_json, None, None),  # норм
    ([0, 36, 45, 46], 'www', new_label_46_data_json, None, None),  # норм
    ([0, 52], 'www52', new_label_52_data_json, ValueError, "Cannot be added to a label/file"),  # error копирование в файл
    ([0, 21, 22, 23], 'www23', new_label_23_data_json, ValueError, "Cannot be added to a label/file"),  # error копирование в файл
    ([0, 21, 22, 123], 'wxw', start_data_json, ValueError, "Error with id"),  # error превышение id
    ([0], 'Z99task3b1.txt', new_label_0_copy_root_data_json, None, None)  # вставка с copy
])
def test_new_label(index, name, data, expected_exception, text_error):
    tree.set(start_data_json)
    tree.new_label(index, name)
    pprint.pprint(tree.get())
    tree.set(start_data_json)
    # if expected_exception:
    #     with pytest.raises(expected_exception, match="Cannot be added to a label/file"):
    #         assert tree.new_label(index, name) == data
    # else:
    #     assert tree.new_label(index, name) == data
    assert tree.new_label(index, name) == data

# @pytest.mark.parametrize("index, name, data, expected_exception", [
#     ('folder_root', 'www', new_label_folder_root_data_json, None),
#     ('46', 'www', new_folder_46_data_json, None),
#     ('52', 'www', new_folder_46_data_json, ValueError),  # добавление в метку/файл
#     ('152', 'www', start_data_json, None)
# ])
# def test_new_folder(index, name, data, expected_exception):
#     tree.set(start_data_json)
#     if expected_exception:
#         with pytest.raises(expected_exception, match="Cannot be added to a label/file"):
#             assert tree.new_folder(index, name) == data
#     else:
#         assert tree.new_folder(index, name) == data
