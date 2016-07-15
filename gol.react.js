/*
 * Game of life ReactJS version
 */

'use strict';


import React, { Component } from 'react'
import { render } from 'react-dom'
import _ from 'lodash'


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


class Cell extends Component {
  render() {
    let color = this.props.v===1 ? 'green': 'white';

    return (
      <td style={{backgroundColor:color}}> </td>
    )
  }
}


class Row extends Component {
  render() {
    let cells = this.props.cells.map(function(c, k) {
      return <Cell v={c} key={k}/>;
    });

    return (
      <tr>{cells}</tr>
    )
  }
}


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {rows: 30, cols: 30, delay: 500, lives: [], interval: undefined};
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onColsChange = this.onColsChange.bind(this);
    this.onDelayChange = this.onDelayChange.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  onRowsChange(e) {
    this.setState({rows: parseInt(e.target.value)});
  }

  onColsChange(e) {
    this.setState({cols: parseInt(e.target.value)});
  }

  onDelayChange(e) {
    this.setState({delay: parseInt(e.target.value)});
  }

  onPlay() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }

    let game = new GameOfLife(this.state.rows, this.state.cols);
    game.initBoard();
    this.setState({lives: game.getLives()});

    let itv = setInterval(()=>{
      game.nextRound();
      this.setState({lives: game.getLives()});
    }, this.state.delay);
    this.setState({interval: itv});
  }

  render() {
    let rows = this.state.lives.map(function(row, k) {
      return <Row cells={row} key={k}/>;
    });

    return (
      <div>
        <div>
          <label>Rows:</label>
          <input id="rows" type="text" value={this.state.rows} onChange={this.onRowsChange}/>
          <label>Cols:</label>
          <input id="cols" type="text" value={this.state.cols} onChange={this.onColsChange}/>
          <label>Delay:</label>
          <input id="delay" type="text" value={this.state.delay} onChange={this.onDelayChange}/>
          <button onClick={this.onPlay}>Play</button>
        </div>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
};


render(<App/>, document.getElementById('board'));

