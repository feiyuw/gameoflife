/*
 * Game of life ReactJS version
 */
'use strict'

import React, { Component } from 'react'
import { render } from 'react-dom'
import _ from 'lodash'


class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this._lives = []
    this._next_lives = []
  }

  initBoard = () => {
    this._lives = _.range(this.rows)
      .map((r) => (
        _.range(this.cols).map((c) => Math.round(Math.random()))
      ))
    this._next_lives = _.range(this.rows).map((r) => _.range(this.cols))
  }

  getLives = () => this._lives

  nextRound = () => {
    for(let x = 0; x < this.rows; x++) {
      for(let y = 0; y < this.cols; y++) {
        let nbCount = _([
          this._lives[x-1] && this._lives[x-1][y-1],
          this._lives[x-1] && this._lives[x-1][y],
          this._lives[x-1] && this._lives[x-1][y+1],
          this._lives[x][y-1],
          this._lives[x][y+1],
          this._lives[x+1] && this._lives[x+1][y-1],
          this._lives[x+1] && this._lives[x+1][y],
          this._lives[x+1] && this._lives[x+1][y+1],
        ]).compact().sum()

        if ((this._lives[x][y]===1 && _.includes([2,3], nbCount)) || this._lives[x][y]===0 && nbCount===3) {
          this._next_lives[x][y] = 1
        } else {
          this._next_lives[x][y] = 0
        }
      }
    }

    this._lives = this._next_lives
    this._next_lives = _.range(this.rows).map((r) => _.range(this.cols))
  }
}


const Cell = (props) => (
  <div className="cell" {...props}></div>
)


const Row = ({cells}) => (
  <div className="row">
    {
      cells.map((c, k) => <Cell data={c} key={k}/>)
    }
  </div>
)


class App extends Component{
  rows = 30
  cols = 30
  delay = 500
  interval = undefined
  lives = []

  state = {loading: true}

  onRowsChange = (e) => {
    this.rows = parseInt(e.target.value) || ''
  }

  onColsChange = (e) => {
    this.cols = parseInt(e.target.value) || ''
  }

  onDelayChange = (e) => {
    this.delay = parseInt(e.target.value) || ''
  }

  onPlay = () => {
    if (this.interval) {
      clearTimeout(this.interval)
    }

    const game = new GameOfLife(this.rows, this.cols)
    game.initBoard()

    const handler = () => {
      game.nextRound()
      this.lives = game.getLives()
      this.setState({loading: false})
      this.interval = setTimeout(handler, this.delay)
    }

    handler()
  }

  render() {
    return (
      <div>
        <div>
          <label>Rows:</label>
          <input id="rows" type="text" value={this.rows} onChange={this.onRowsChange}/>
          <label>Cols:</label>
          <input id="cols" type="text" value={this.cols} onChange={this.onColsChange}/>
          <label>Delay:</label>
          <input id="delay" type="text" value={this.delay} onChange={this.onDelayChange}/>
          <button onClick={this.onPlay}>Play</button>
        </div>
        <div className="table">
          {
            this.state.loading || this.lives.map((row, k) => <Row cells={row} key={k}/>)
          }
        </div>
      </div>
    )
  }
}


render(<App/>, document.getElementById('board'))
