/*
  Fudoku is a Sudoku game primarily designed for the Firefox OS
  Fudoku is a fork of FFDoku
  Copyright (C) 2012-2013 Erwan GUYADER <taratatach@mozfr.org>, Antoine DUPARAY <antoine.duparay@mozfr.org>
  Copyright (C) 2013 Super Football Star

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function () {
  function init() {
    var game = new Game('easy');
    new Grid(game);
  }

  window.addEventListener('load', init, false);
})();
