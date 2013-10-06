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

/* SITES INTERESSANTS
 *
 * http://killdream.github.com/blog/2011/10/understanding-javascript-oop/
 */

/*
 * Class representing the game interactions
 */
function Grid (game) {
  /* Initialize attributes */
  this.game = game;

  this.commands = document.getElementById('commands');
  this.commands.className = 'hide';
  this.gameInfos = document.getElementById('gameInfos');
  this.gameInfos.className = 'hidden';
  this.about = document.getElementById('about');
  this.about.className = 'hidden';
  this.newGame = document.getElementById('newGame');
  this.cancel = document.querySelector('button[role="cancel"]');
  this.levels = document.querySelectorAll('button[role="level"]');
  this.reset = document.getElementById('reset');
  this.dispAbout = document.getElementById('dispAbout');
  this.ok = document.getElementById('ok');
  this.inserts = document.getElementsByClassName('insert');
  this.erase = document.getElementById('erase');
  this.help = document.getElementById('help');

  this.initGrid(this.game.baseGrid);
  this.addEvents();
  this.modifiedCell = null;
}

/*
 * Create the grid and fill it with the revealed numbers
 */
Grid.prototype.initGrid = function (gameGrid) {
  var self = this;
  var table = document.getElementById('grid');

  this.cells = [];
  for (var i=0; i<9; i++) {
    var tr = document.createElement('tr');
    table.appendChild(tr);
    var currentRow = 'row'+(i+1);

    this.cells[i] = [];
    for (var j=0; j<9; j++) {
      var td = document.createElement('td');
      var currentColumn = 'column'+(j+1);

      td.id = String((i+1) + '-' + (j+1));
      if (!gameGrid[i][j]) {
        td.className = 'cell';
      }
      else {
        td.className = 'number';
        td.innerHTML = gameGrid[i][j];
      }
      var remainder = i % 3;
      var blockRowNumber = ((i-remainder)/3)+1;
      remainder = j % 3;
      var blockColumnNumber = ((j-remainder)/3)+1;
      
      addClass(td, currentRow);
      addClass(td, currentColumn);
      addClass(td, 'block'+blockRowNumber+blockColumnNumber);

      if (i % 3 == 2)
          addClass(td, 'borderBottom');
      if (i % 3 == 0)
          addClass(td, 'borderTop');
      if (j % 3 == 2)
          addClass(td, 'borderRight');
      if (j % 3 == 0)
          addClass(td, 'borderLeft');

      tr.appendChild(td);

      this.cells[i][j] = td;
    }
  }

  /* Add events */
  self.addCellEvents.call(self);
}

/*
 * Add events to every cell
 */
Grid.prototype.addCellEvents = function () {
  var self = this;

  var cells = document.getElementsByClassName('cell');
  for(var i=0; i<cells.length; i++) {
    cells[i].addEventListener('click', function(e) {
      self.getEvtClickCell.call(self, e);
    }, false);
    cells[i].addEventListener('change', function(e) {
      self.getEvtChangeCell.call(self, e);
    }, false);
  }
}

/*
 * Add events to every button but also the body itself
 */
Grid.prototype.addEvents = function () {
  var self = this;

  document.addEventListener('click', function(e) {
    self.getEvtBody.call(self, e);
    self.removeSelections.call(self, e);
  }, false);

  this.newGame.addEventListener('click', function(e) {
    self.getEvtNewGame.call(self, e);
  }, false);

  for (var i = this.levels.length - 1; i >= 0; i--) {
    this.levels[i].addEventListener('click', function (e) {
      self.getEvtStartGame.call(self, e);
    }, false);
  }

  this.cancel.addEventListener('click', function (e) {
    self.getEvtCancel.call(self, e);
  }, false);

  this.reset.addEventListener('click', function(e) {
    self.getEvtReset.call(self, e);
  }, false);

  this.dispAbout.addEventListener('click', function(e) {
    self.getEvtAbout.call(self, e);
  }, false);

  this.ok.addEventListener('click', function (e) {
    self.getEvtCancelAbout.call(self, e);
  }, false);

  for(var i=0; i<this.inserts.length; i++) {
    this.inserts[i].addEventListener('click', function(e) {
      self.getEvtInsert.call(self, e);
    }, false);
  }

  this.erase.addEventListener('click', function(e) {
    self.getEvtErase.call(self, e);
  }, false);

  this.help.addEventListener('click', function(e) {
    self.getEvtHelp.call(self, e);
  }, false);
}

/*
 * Called when body is clicked but no other event is called before
 * ( asserted with stopPropagation() in the other click handlers )
 */
Grid.prototype.getEvtBody = function (e) {
  this.commands.className = 'hide';
  this.removeSelections.call(this, e);
}

Grid.prototype.removeSelections = function (e) {
  var selectedCells = document.getElementsByClassName('selected-row');
  for (var i=selectedCells.length-1; i>=0; i--) {
    removeClass(selectedCells[i], 'selected-row');
  }

  var selectedCells = document.getElementsByClassName('selected-column');
  for (var i=selectedCells.length-1; i>=0; i--) {
    removeClass(selectedCells[i], 'selected-column');
  }

  var selectedCells = document.getElementsByClassName('selected-block');
  for (var i=selectedCells.length-1; i>=0; i--) {
    removeClass(selectedCells[i], 'selected-block');
  }

  var selectedCells = document.getElementsByClassName('selected');
  for (var i=selectedCells.length-1; i>=0; i--) {
    removeClass(selectedCells[i], 'selected');
  }

  var selectedCells = document.getElementsByClassName('not-this-number');
  for (var i=selectedCells.length-1; i>=0; i--) {
    removeClass(selectedCells[i], 'not-this-number');
  }
}


/*
 * Called when a cell is clicked, either with a revealed number or
 * an editable one.
 * Change the visibility of the insertion "popup"
 */
Grid.prototype.getEvtClickCell = function (e) {
  if (this.gameInfos.className == 'hidden' && this.about.className == 'hidden') {
    //if (this.commands.className == 'hide') {
      this.removeSelections.call(this, e);
      this.commands.className = 'hide';

      if (this.modifiedCell) {
        removeClass(this.modifiedCell, 'selected');
      }

      this.modifiedCell = e.target;
      var strs = this.modifiedCell.id.split('-');

      var rowClass = getClassNameLike(this.modifiedCell, 'row');
      var columnClass = getClassNameLike(this.modifiedCell, 'column');
      var blockClass = getClassNameLike(this.modifiedCell, 'block');
      
      var rowCells = document.getElementsByClassName(rowClass);
      for (var i=0; i<rowCells.length; i++) {
        addClass(rowCells[i], 'selected-row');
      }

      var columnCells = document.getElementsByClassName(columnClass);
      for (var i=0; i<columnCells.length; i++) {
        addClass(columnCells[i], 'selected-column');
      }
      
      var blockCells = document.getElementsByClassName(blockClass);
      for (var i=0; i<blockCells.length; i++) {
        addClass(blockCells[i], 'selected-block');
      }
      
      addClass(this.modifiedCell, 'selected');

      this.commands.className = 'show';
    //}
    //else {
    //}
    e.stopPropagation();
  }
}

/*
 * Called when the content of an editable cell is changed.
 * Call the verification method of the Game class to check
 * if the inserted number is correct or not, changing the
 * cell's color accordingly.
 */
Grid.prototype.getEvtChangeCell = function (e) {
  this.modifiedCell = e.target;

  // get cell value, cell line and cell column
  var value = this.modifiedCell.innerHTML;
  var strs = this.modifiedCell.id.split('-');
  var line = parseInt(strs[0])-1;
  var col = parseInt(strs[1])-1;

  // check if value inserted is correct, otherwise change background to red
  if (!this.game.respect(value, line, col)) {
    //removeClass(this.modifiedCell, 'right');
    addClass(this.modifiedCell, 'wrong');
  }
  else {
    removeClass(this.modifiedCell, 'wrong');
    //addClass(this.modifiedCell, 'right');
  }

  // insert value in Game.grid
  this.game.changeValue(value,  line, col);
}

/*
 * Called when the user clicks on a number in the insertion "popup"
 */
Grid.prototype.getEvtInsert = function (e) {
  this.modifiedCell.innerHTML = e.target.innerHTML;
  this.commands.className = 'hide';
  this.removeSelections.call(this, e);
  var event = document.createEvent('HTMLEvents');
  event.initEvent('change',true,false);
  this.modifiedCell.dispatchEvent(event);
  e.stopPropagation();
}

/*
 * Called when the user clicks on the Erase button in the insertion "popup"
 */
Grid.prototype.getEvtErase = function(e) {
  // get cell line and cell column
  var strs = this.modifiedCell.id.split('-');
  var line = parseInt(strs[0])-1;
  var col = parseInt(strs[1])-1;

  // insert null value in Game.grid
  this.game.changeValue(null,  line, col);

  this.modifiedCell.innerHTML = '';
  //removeClass(this.modifiedCell, 'right');
  removeClass(this.modifiedCell, 'wrong');
  this.commands.className = 'hide';
  this.removeSelections.call(this, e);
  e.stopPropagation();
 }

/*
 * Called when the user clicks on the Help button in the insertion "popup"
 */
Grid.prototype.getEvtHelp = function(e) {
  // get cell line and cell column
  var strs = this.modifiedCell.id.split('-');
  var line = parseInt(strs[0]);
  var col = parseInt(strs[1]);
  var blockClass = getClassNameLike(this.modifiedCell, 'block');
  var elements = []

  var rowCells = document.getElementsByClassName('row'+line);
  for (var i=0; i<rowCells.length; i++) {
    if (rowCells[i].innerHTML.length > 0) {
      elements.push(rowCells[i].innerHTML);
    }
  }

  var columnCells = document.getElementsByClassName('column'+col);
  for (var i=0; i<columnCells.length; i++) {
    if (columnCells[i].innerHTML.length > 0) {
      elements.push(columnCells[i].innerHTML);
    }
  }
  
  var blockCells = document.getElementsByClassName(blockClass);
  for (var i=0; i<blockCells.length; i++) {
    if (blockCells[i].innerHTML.length > 0) {
      elements.push(blockCells[i].innerHTML);
    }
  }
  
  uniqueElements = elements.filter(function(element, position) {
    return elements.indexOf(element) == position;
  });
  
  uniqueElements.sort();
  
  for (var i=0; i<uniqueElements.length; i++) {
    var commandElement = document.getElementById('com'+uniqueElements[i]);
    addClass(commandElement, 'not-this-number');
  }

  e.stopPropagation();
 }

/*
 * Called when the user clicks on the New Game button
 * Shows the new game "popup"
 */
Grid.prototype.getEvtNewGame = function (e) {
  if (this.commands.className == 'hide' && this.about.className == 'hidden') {
    this.gameInfos.className = 'displayed';
    e.stopPropagation();
  }
}

/*
 * Called when the user clicks on the About button
 * Shows the about "popup"
 */
Grid.prototype.getEvtAbout = function (e) {
  if (this.commands.className == 'hide' && this.gameInfos.className == 'hidden') {
    this.about.className = 'displayed';
    e.stopPropagation();
  }
}

/*
 * Called when the user clicks on the Cancel button in the about "popup"
 * Hide the about "popup"
 */
Grid.prototype.getEvtCancelAbout = function (e) {
  this.about.className = 'hidden';
  e.stopPropagation();
}

/*
 * Called when the user clicks on the Cancel button in the new game "popup"
 * Hide the new game "popup"
 */
Grid.prototype.getEvtCancel = function (e) {
  this.gameInfos.className = 'hidden';
  e.stopPropagation();
}

/*
 * Called when the user clicks on the Start Game button in the new game "popup"
 * Hide the new game popup, delete the current grid, create a new game with the
 * Game class and create a new grid with the new revealed numbers
 */
Grid.prototype.getEvtStartGame = function (evt) {
  var level = evt.target.value;
  console.log(level);
  /* Create new game */
  this.game.newGame(level);

  /* delete previous grid */
  var table =  document.getElementById('grid');
  table.innerHTML = '';

  /* init new grid */
  this.initGrid(this.game.baseGrid);

  this.gameInfos.className = 'hidden';
}

/*
 * Called when the user clicks on the Reset button
 * Delete the current grid and create a new one with only the revealed numbers
 * from the Game class
 */
Grid.prototype.getEvtReset = function (e) {
  if (this.commands.className == 'hide'
    && this.gameInfos.className == 'hidden'
    && this.about.className == 'hidden') {
    this.game.resetGame();

    /* delete previous grid */
    var table =  document.getElementById('grid');
    table.innerHTML = '';

    /* init new grid */
    this.initGrid(this.game.baseGrid);

    e.stopPropagation();
  }
}
