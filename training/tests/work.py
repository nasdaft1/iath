import pprint

import pytest

from utils.work_tree import *
from data_json import *

tree.set(start_data_json)
# # Печать содержимого JSON файла
pprint.pprint(tree.get())
# tree.new_label(41, 'xxxx')
# pprint.pprint(tree.get())

x = {'root': {'#0#id': 0,
              '#1#folder': {'1A': {'#0#id': 21,
                                   '#1#folder': {'task1a1': {'#0#id': 22,
                                                             '#1#folder': {'111task1a1.txt': {'#0#id': 23,
                                                                                              '#1#folder': None},
                                                                           '222task1a1.txt': {'#0#id': 24,
                                                                                              '#1#folder': None},
                                                                           '333task1a1.txt': {'#0#id': 25,
                                                                                              '#1#folder': None},
                                                                           'task3b1': {'#0#id': 26,
                                                                                       '#1#folder': {
                                                                                           'G333task1a1.txt': {
                                                                                               '#0#id': 27,
                                                                                               '#1#folder': None}}}}},
                                                 'task2a1': {'#0#id': 28,
                                                             '#1#folder': {'444task2a1.txt': {'#0#id': 29,
                                                                                              '#1#folder': None},
                                                                           '555task2a1.txt': {'#0#id': 30,
                                                                                              '#1#folder': None},
                                                                           '666task2a1.txt': {'#0#id': 31,
                                                                                              '#1#folder': None}}},
                                                 'task3a1': {'#0#id': 32,
                                                             '#1#folder': {'777task3a1.txt': {'#0#id': 33,
                                                                                              '#1#folder': None},
                                                                           '888task3a1.txt': {'#0#id': 34,
                                                                                              '#1#folder': None},
                                                                           '999task3a1.txt': {'#0#id': 35,
                                                                                              '#1#folder': None}}}}},
                            '1B': {'#0#id': 36,
                                   '#1#folder': {'task2b1': {'#0#id': 41,
                                                             '#1#folder': {'xxxx': {'#0#id': 53,
                                                                                    '#1#folder': None}}}}}}}}

del_ew = {'root': {'#0#id': 0,
                   '#1#folder': {'1A': {'#0#id': 21,
                                        '#1#folder': {'task1a1': {'#0#id': 22,
                                                                  '#1#folder': {
                                                                      '111task1a1.txt': {'#0#id': 23,
                                                                                         '#1#folder': None},
                                                                      '222task1a1.txt': {'#0#id': 24,
                                                                                         '#1#folder': None},
                                                                      '333task1a1.txt': {'#0#id': 25,
                                                                                         '#1#folder': None},
                                                                      'task3b1': {'#0#id': 26,
                                                                                  '#1#folder': {
                                                                                      'G333task1a1.txt': {
                                                                                          '#0#id': 27,
                                                                                          '#1#folder': None}}}}},
                                                      'task2a1': {'#0#id': 28,
                                                                  '#1#folder': {
                                                                      '444task2a1.txt': {'#0#id': 29,
                                                                                         '#1#folder': None},
                                                                      '555task2a1.txt': {'#0#id': 30,
                                                                                         '#1#folder': None},
                                                                      '666task2a1.txt': {'#0#id': 31,
                                                                                         '#1#folder': None}}},
                                                      'task3a1': {'#0#id': 32,
                                                                  '#1#folder': {
                                                                      '777task3a1.txt': {'#0#id': 33,
                                                                                         '#1#folder': None},
                                                                      '888task3a1.txt': {'#0#id': 34,
                                                                                         '#1#folder': None},
                                                                      '999task3a1.txt': {'#0#id': 35,
                                                                                         '#1#folder': None}}}}},
                                 '1B': {'#0#id': 36,
                                        '#1#folder': {'task1b1': {'#0#id': 37,
                                                                  '#1#folder': {
                                                                      '111task1b1.txt': {'#0#id': 38,
                                                                                         '#1#folder': None},
                                                                      '222task1b1.txt': {'#0#id': 39,
                                                                                         '#1#folder': None},
                                                                      '333task1b1.txt': {'#0#id': 40,
                                                                                         '#1#folder': None}}},
                                                      'task2b1': {'#0#id': 41,
                                                                  '#1#folder': {
                                                                      '444task2b1.txt': {'#0#id': 42,
                                                                                         '#1#folder': None},
                                                                      '555task2b1.txt': {'#0#id': 43,
                                                                                         '#1#folder': None},
                                                                      '666task2b1.txt': {'#0#id': 44,
                                                                                         '#1#folder': None}}},
                                                      'task3b1': {'#0#id': 45,
                                                                  '#1#folder': {'1': {'#0#id': 46,
                                                                                      '#1#folder': {
                                                                                          'task1b1': {
                                                                                              '#0#id': 47,
                                                                                              '#1#folder': {}}}},
                                                                                '777task3b1.txt': {
                                                                                    '#0#id': 49,
                                                                                    '#1#folder': None},
                                                                                '888task3b1.txt': {
                                                                                    '#0#id': 50,
                                                                                    '#1#folder': None},
                                                                                '999task3b1.txt': {
                                                                                    '#0#id': 51,
                                                                                    '#1#folder': None}}}}},
                                 'Z99task3b1.txt': {'#0#id': 52, '#1#folder': None}},
                   '#2#max_id': 52}}
print('-' * 100)
# pprint.pprint(delete_json(start_data_json, [0, 36, 45, 46, 47, 48]))
#
# pprint.pprint(delete_json(start_data_json, [0, 52]))

# pprint.pprint(rename_json(start_data_json, [0, 36, 45, 46, 47, 48],'xxx'))

# pprint.pprint(rename_json(start_data_json, [0, 52],'xxx'))
# pprint.pprint(buffer_insert(start_data_json, [0, 52],'xxx'))

pprint.pprint(tree.new_folder([0], 'www'))
pprint.pprint(tree.new_folder([0], 'Z99task3b1.txt'))
pprint.pprint(tree.new_folder([0, 36, 45, 46, 47, 48], 'Z99task3b1.txt'))
#pprint.pprint(tree.new_folder([0, 36, 45, 46, 47], 'Z99task3b1.txt'))
# pprint.pprint(buffer_insert(start_data_json, [0, 0], {'Z99task3b1.txt': {'#1#folder': {}, '#0#id': 53}}))
