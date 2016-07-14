"use strict";


function GameOfLife(rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this._lives = [];
}


GameOfLife.prototype.initBoard = function() {
  var self = this;
  self._lives = _.range(this.rows)
    .map((r) => {
      return _.range(this.cols)
        .map((c) => {
          return Math.round(Math.random());
        })
    });
}


GameOfLife.prototype.getLives = function() {
  return this._lives;
}


GameOfLife.prototype.nextRound = function() {
  var self = this;
  var lives = self.getLives();
  var newLives = _.range(self.rows).map((x) => _.range(self.cols));

  for(var x=0; x<self.rows; x++) {
    for(var y=0; y<self.cols; y++) {
      var nbCount = _([
        lives[x-1] && lives[x-1][y-1],
        lives[x-1] && lives[x-1][y],
        lives[x-1] && lives[x-1][y+1],
        lives[x][y-1],
        lives[x][y+1],
        lives[x+1] && lives[x+1][y-1],
        lives[x+1] && lives[x+1][y],
        lives[x+1] && lives[x+1][y+1],
      ]).compact().sum();

      if ((lives[x][y]===1 && _.includes([2,3], nbCount)) || lives[x][y]===0 && nbCount===3) {
        newLives[x][y] = 1;
      } else {
        newLives[x][y] = 0;
      }
    }
  }

  self._lives = newLives;
  newLives = undefined;
}


function Board(container) {
  var chart = {left: 20, top: 20, r: 5, border: 2};
  var svg = d3.select(container).append('svg');

  function arrayToObject(arr) {
    var obj = [];

    for(var x=0; x<arr.length; x++) {
      for(var y=0; y<arr[x].length; y++) {
        obj.push({
          x: x,
          y: y,
          v: arr[x][y]
        });
      }
    }

    return obj
  }

  chart.render = function(lives) {
    var data = arrayToObject(lives);

    svg.attr('height', (chart.r*2+chart.border)*lives.length+chart.top);

    // Enter
    svg.selectAll('circle')
      .data(data)
      .enter()
        .append('circle')
          .attr('cx', function(d) {
            return d.y * (chart.r * 2 + chart.border) + chart.left;
          })
          .attr('cy', function(d) {
            return d.x * (chart.r * 2 + chart.border) + chart.top;
          })
          .attr('r', chart.r)
          .attr('fill', function(d) {
            return d.v === 1 ? 'green': 'white';
          });

    // Update
    svg.selectAll('circle')
      .data(data)
        .attr('fill', function(d) {
          return d.v === 1 ? 'green': 'white';
        });

    // Exit
    svg.selectAll('circle')
      .data(data)
      .exit()
        .remove();
  }

  return chart;
}
