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


class Board {
  constructor(container) {
    this.chart = {left: 20, top: 20, r: 5, border: 2}
    this.svg = d3.select(container).append('svg')
  }

  arrayToObject = (arr) => (
    _.flatten(_.range(arr.length).map((x) => (
      _.range(arr[0].length).map((y) => {
        return {x: x, y: y, v: arr[x][y]}
      })
    )))
  )

  render = (lives) => {
    const data = this.arrayToObject(lives)
    console.log(data[0])

    this.svg.attr('height', (this.chart.r * 2 + this.chart.border) * lives.length + this.chart.top)
    // Enter
    this.svg.selectAll('circle')
      .data(data)
      .enter()
        .append('circle')
        .attr('cx', (d) => (
            d.y * (this.chart.r * 2 + this.chart.border) + this.chart.left
          ))
        .attr('cy', (d) => (
            d.x * (this.chart.r * 2 + this.chart.border) + this.chart.top
          ))
        .attr('r', this.chart.r)
        .attr('data', (d) => d.v)

    // Update
    this.svg.selectAll('circle')
      .data(data)
      .attr('data', (d) => d.v)

    // Exit
    this.svg.selectAll('circle')
      .data(data)
      .exit()
        .remove()
  }
}
