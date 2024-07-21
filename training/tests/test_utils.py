import pytest
import pprint

from utils.work_tree import *
from data_json import *

# Путь к вашему JSON файлу
file_path = 'data.json'

tree.set(start_data_json)
# Печать содержимого JSON файла
pprint.pprint(tree.get())


@pytest.mark.parametrize("index, data, index_lighting, expected_exception, text_error", [
    ([0, 21], delete_21_data_json, None, None, None),
    ([0, 21, 22, 26, 27], delete_27_data_json, None, None, None),  # No exception expected
    ([0, 52], delete_52_data_json, None, None, None),
    ([0, 152], delete_52_data_json, None, IndexError, "Action failed")
])
def test_delete(index, data, index_lighting, expected_exception, text_error):
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            result_data, index_add = tree.delete(index)
            assert result_data == data
            assert index_add == index_lighting
    else:
        result_data, index_add = tree.delete(index)
        assert result_data == data
        assert index_add == index_lighting


@pytest.mark.parametrize("index, name, data, index_lighting, expected_exception, text_error", [
    ([0, 52], 'xxxx.txt', rename_52_data_json, 52, None, None),
    ([0, 21], 'wwww', rename_21_data_json, 21, None, None),  # No exception expected
    ([0, 36, 45, 46, 47, 48], 'hhhh', rename_48_data_json, 48, None, None),  # No exception expected
    ([0, 152], 'xd2', rename_21_data_json, None, IndexError, "Action failed")
])
def test_rename(index, name, data, index_lighting, expected_exception, text_error):
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            result_data, index_add = tree.rename(index, name)
            assert result_data == data
            assert index_add == index_lighting

    else:
        result_data, index_add = tree.rename(index, name)
        assert result_data == data
        assert index_add == index_lighting


@pytest.mark.parametrize("index, name, data, index_lighting, expected_exception, text_error", [
    ([0], 'www0', new_label_0_root_data_json, 53, None, None),  # норм
    ([0, 36, 45, 46], 'www', new_label_46_data_json, 53, None, None),  # норм
    ([0, 52], 'www52', new_label_52_data_json, None, ValueError, "Cannot be added to a label/file"),
    # error копирование в файл
    ([0, 21, 22, 23], 'www23', new_label_23_data_json, None, ValueError, "Cannot be added to a label/file"),
    # error копирование в файл
    ([0, 21, 22, 123], 'wxw', None, start_data_json, IndexError, "Action failed"),  # error превышение id
    ([0], 'Z99task3b1.txt', new_label_0_copy_root_data_json, 53, None, None)  # вставка с copy
])
def test_new_label(index, name, data, index_lighting, expected_exception, text_error):
    # pprint.pprint(tree.get())
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            result_data, index_add = tree.new_label(index, name)
            assert result_data == data
            assert index_add == index_lighting
    else:
        result_data, index_add = tree.new_label(index, name)
        assert result_data == data
        assert index_add == index_lighting


@pytest.mark.parametrize("index, name, data, index_lighting, expected_exception, text_error", [
    ([0], 'www0', new_folder_0_root_data_json, 53, None, None),  # норм
    ([0, 36, 45, 46], 'www', new_folder_46_data_json, 53, None, None),  # норм
    ([0, 52], 'www52', new_folder_52_data_json, None, ValueError, "Cannot be added to a label/file"),
    # error копирование в файл
    ([0, 21, 22, 23], 'www23', new_folder_23_data_json, None, ValueError, "Cannot be added to a label/file"),
    # error копирование в файл
    ([0, 21, 22, 123], 'wxw', start_data_json, None, IndexError, "Action failed"),  # error превышение id
    ([0], 'Z99task3b1.txt', new_folder_0_copy_root_data_json, 53, None, None)  # вставка с copy
])
def test_new_folder(index, name, data, index_lighting, expected_exception, text_error):
    # pprint.pprint(tree.get())
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            result_data, index_add = tree.new_folder(index, name)
            assert result_data == data
            # assert index_add == index_lighting
    else:
        result_data, index_add = tree.new_folder(index, name)
        assert result_data == data
        # assert index_add == index_lighting


@pytest.mark.parametrize("index, data, expected_exception, text_error", [
    ([0, None], start_data_json, None, None),
    ([0, 36, 45, 46, 47, None], buffer_copy_47, None, None),
    ([0, 52, None], buffer_copy_52, None, None),
    ([0, 21, 22, None], buffer_copy_22, None, None),
    ([0, 21, 22, 123, None], start_data_json, TypeError, "cannot unpack non-iterable NoneType object"),
    # error превышение id
    ([0, 21, 122, 23, None], start_data_json, TypeError, "cannot unpack non-iterable NoneType object")
    # error превышение id
])
def test_buffer_copy(index, data, expected_exception, text_error):
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            assert buffer_copy(tree.get(), index) == data
    else:
        assert buffer_copy(tree.get(), index) == (data, True)


@pytest.mark.parametrize("index, data, expected_exception, text_error", [
    ([0, None], start_data_json, None, None),
    ([0, 36, 45, 46, 47, None], buffer_copy_47, None, None),
    ([0, 52, None], buffer_copy_52, None, None),
    ([0, 21, 22, None], buffer_copy_22, None, None),
    ([0, 21, 22, 123, None], start_data_json, TypeError, "cannot unpack non-iterable NoneType object"),
    # error превышение id
    ([0, 21, 122, 23, None], start_data_json, TypeError, "cannot unpack non-iterable NoneType object")
    # error превышение id
])
def test_buffer_copy(index, data, expected_exception, text_error):
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            assert buffer_copy(tree.get(), index) == data
    else:
        assert buffer_copy(tree.get(), index) == (data, True)


@pytest.mark.parametrize("index_start,index_max, insert, data, data_index, expected_exception, text_error", [
    (100, 102, 2, buffer_copy_47, buffer_copy_47_index, None, None),
    (300, 301, 1, buffer_copy_52, buffer_copy_52_index, None, None),
    (200, 206, 6, buffer_copy_22, buffer_copy_22_index, None, None),
])
def test_buffer_indexation(index_start, index_max, insert, data, data_index, expected_exception, text_error):
    tree.set(start_data_json)
    value, result, index_max_result = buffer_indexation(data, index_start, [])
    assert value == data_index
    assert len(result) == insert
    assert index_max_result == index_max


@pytest.mark.parametrize("index_add, index_copy, index_insert, data, index_lighting, expected_exception, text_error", [
    ([[48, 54], [47, 53]], [0, 36, 45, 46, 47], [0, 21, 22], insert_22_47, None, None, None),
    ([[52, 53]], [0, 52], [0, 21, 22], insert_22_52, None, None, None),
    ([], [0, 52], [0, 21, 122], insert_22_52, None, IndexError, "Action failed"),
    ([], [0, 152], [0, 21, 22], insert_22_52, None, TypeError, "cannot unpack non-iterable NoneType object")
])
def test_buffer_insert(index_add, index_copy, index_insert, data, index_lighting, expected_exception, text_error):
    tree.set(start_data_json)
    if expected_exception:
        with pytest.raises(expected_exception, match=text_error):
            data_buffer, index_light, insert_index = tree.copy_insert_data(index_copy, index_insert)
            assert data_buffer == data
    else:
        data_buffer, index_light, insert_index = tree.copy_insert_data(index_copy, index_insert)
        assert data_buffer == data
        assert insert_index == index_add
