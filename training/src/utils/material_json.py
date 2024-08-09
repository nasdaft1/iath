import uuid
import pprint


def make_json() -> [list, int]:
    data = []
    index = 0
    for row in range(1, 6):

        data_row = []
        for cell in range(0, 3):
            data_cell = {
                'id_audio': str(uuid.uuid4()),
                'text_content': f'row {index} col {cell}',
            }
            data_row.append(data_cell)
        data.append(data_row)
        index += 1
    data.append([{'id_audio': None, 'text_content': '1'},
                 {'id_audio': None, 'text_content': '2'},
                 {'id_audio': None, 'text_content': '3'}])
    # data=[]# проверка пустых данных
    # pprint.pprint(data)
    return data
