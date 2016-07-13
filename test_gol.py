import unittest
from gol import get_next_round_players


class TestGetNextRoundPlayers(unittest.TestCase):
    def test_all_dead(self):
        self._assert([[0,0,0], [0,0,0], [0,0,0]], [[0,0,0], [0,0,0], [0,0,0]])

    def test_one_live(self):
        self._assert([[0,0,0], [0,1,0], [0,0,0]], [[0,0,0], [0,0,0], [0,0,0]])

    def test_one_live_with_2_lives_neighbours(self):
        self._assert([[1,0,0], [0,1,0], [0,0,1]], [[0,0,0], [0,1,0], [0,0,0]])

    def test_one_dead_with_3_lives_become_live(self):
        self._assert([[0,1,0], [1,1,0], [0,0,0]], [[1,1,0], [1,1,0], [0,0,0]])

    def test_one_live_with_4_lives_neighbours(self):
        self._assert([[1,1,1], [0,1,0], [0,1,0]], [[1,1,1], [0,0,0], [0,0,0]])

    def test_with_4_multi_4_boards(self):
        self._assert([[1,1,1,1], [0,1,0,1], [0,1,0,0], [0,0,0,0]],[[1,1,0,1], [0,0,0,1], [0,0,1,0], [0,0,0,0]])

    def test_with_4_multi_3_boards(self):
        self._assert([[1,1,1,1], [0,1,0,1], [0,1,0,0]],[[1,1,0,1], [0,0,0,1], [0,0,1,0]])

    def _assert(self, cur_players, next_players):
        self.assertEqual(get_next_round_players(cur_players), next_players)


if __name__ == '__main__':
    unittest.main()
