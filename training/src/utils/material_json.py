def make_json() -> [list, int]:
    data = []
    index = 0
    for row in range(1, 30):
        data.append([index, f'row {index} col 1', f'row {index} col 2', f'row {index} col 3'])
        index += 1
    return data
