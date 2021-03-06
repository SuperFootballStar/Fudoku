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

/* To shuffle an array */
Array.prototype.shuffle = function() {
  var s = [];
  while (this.length)
    s.push(this.splice(Math.random() * this.length, 1));
  while (s.length)
    this.push(s.pop());
  return this;
}

/* To add a class to a node */
function addClass(node, className) {
    var classes = node.className.split(" ");
    var i = 0;

    while (i < classes.length && classes[i] != className)
        i++;

    if (i >= classes.length)
        node.className += " " + className;
}

/* Get the class name of a node that starts with className */
/* This is used to get the 'rowX' and 'columnX' class names */
function getClassNameLike(node, className) {
    var classes = node.className.split(" ");

    for (var i=0; i<classes.length; i++) {
      if (classes[i].indexOf(className) == 0) {
        return classes[i]
      }
    }
    
    // this should not happen when searching for row or column names
    // however the empry string is a good indicator that it was not found
    return "";
}

function removeDuplicates(elements) {
  
}

/* To remove a class from a node */
function removeClass(node, className) {
  var classes = node.className.split(" ");
  var i = 0;

  while (i < classes.length && classes[i] != className)
    i++;

  if (i < classes.length)
    classes.splice(i, 1);

  node.className = classes.join(" ");
}
