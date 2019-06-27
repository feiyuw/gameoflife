import itertools
import numpy as np
import os
import json
from bottle import get, run, response, static_file


_context = {'players': []}


@get('/gol')
def players():
    response.set_header('Content-Type', 'application/json')
    _context['players'] = get_next_round_players(_context['players'])
    return json.dumps(_context['players'].tolist())


@get('/<row>,<col>')
def index(row, col):
    _context['players'] = np.random.rand(int(row), int(col)).round()
    return static_file('index.html', os.path.abspath(os.path.dirname(__file__)))


def get_next_round_players(players):
    data = np.array(players)
    next_players = np.empty(data.shape).astype(int)
    cord_list = itertools.product(*map(range, data.shape))
    row, col = data.shape
    for x, y in cord_list:
        nb_sum = data[max(0, x-1):min(x+2, row), max(0, y-1):min(y+2, col)].sum() - data[x][y]
        next_players[x][y] = (data[x][y], nb_sum) in ((1, 2), (1, 3), (0, 3)) and 1 or 0

    return next_players


if __name__ == '__main__':
    run()
