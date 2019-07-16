package main

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"
)

const (
	INTERVAL = time.Millisecond * 200 // 200ms
)

var (
	rows = 30            // default rows count
	cols = 60            // default columns count
	sb   strings.Builder // string builder for drawing

	clearScreen = "\u001b[2J"
	cellAlive   = []byte("\u001b[48;5;28m  \u001b[0m")  // green
	cellDead    = []byte("\u001b[48;5;252m  \u001b[0m") // white
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

type game struct {
	rows int
	cols int

	prev    [][]bool
	current [][]bool

	frozen bool // if frozen, game will stop
}

func newGame(rows, cols int) *game {
	prev := make([][]bool, rows)
	current := make([][]bool, rows)

	for x := 0; x < rows; x++ {
		prev[x] = make([]bool, cols)
		current[x] = make([]bool, cols)
		for y := 0; y < cols; y++ {
			current[x][y] = rand.Intn(2) != 0
		}
	}

	return &game{
		rows:    rows,
		cols:    cols,
		prev:    prev,
		current: current,
		frozen:  false,
	}
}

func (g *game) run() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	fmt.Print(clearScreen) // clean the whole screen
	for {
		select {
		case <-c:
			log.Println("Bye.")
			return
		default:
			g.draw()
			g.next()
			if g.frozen {
				log.Println("lives are frozen, game stopped!")
				return
			}
			time.Sleep(INTERVAL)
		}
	}
}

func (g *game) draw() {
	sb.Reset()
	sb.WriteString(fmt.Sprintf("\u001b[%dD", g.rows*(g.cols+1)))
	sb.WriteString(fmt.Sprintf("\u001b[%dA", g.rows))
	for _, col := range g.current {
		for _, cell := range col {
			if cell { // alive
				sb.Write(cellAlive)
			} else {
				sb.Write(cellDead) // dead
			}
		}
		sb.WriteByte('\n')
	}
	fmt.Print(sb.String())
}

func (g *game) next() {
	g.prev, g.current = g.current, g.prev // switch prev and current

	hasChange := false

	for x := 0; x < g.rows; x++ {
		for y := 0; y < g.cols; y++ {
			// get alive count around cell
			aliveCount := 0
			if x > 0 && y > 0 && g.prev[x-1][y-1] { // x-1, y-1
				aliveCount++
			}
			if x > 0 && g.prev[x-1][y] { // x-1, y
				aliveCount++
			}
			if x > 0 && y < g.cols-1 && g.prev[x-1][y+1] { // x-1, y+1
				aliveCount++
			}
			if y > 0 && g.prev[x][y-1] { // x, y-1
				aliveCount++
			}
			if y < g.cols-1 && g.prev[x][y+1] { // x, y+1
				aliveCount++
			}
			if x < g.rows-1 && y > 0 && g.prev[x+1][y-1] { // x+1, y-1
				aliveCount++
			}
			if x < g.rows-1 && g.prev[x+1][y] { // x+1, y
				aliveCount++
			}
			if x < g.rows-1 && y < g.cols-1 && g.prev[x+1][y+1] { // x+1, y+1
				aliveCount++
			}

			if g.prev[x][y] { // alive
				if aliveCount != 2 && aliveCount != 3 {
					g.current[x][y] = false
					if !hasChange {
						hasChange = true
					}
				} else {
					g.current[x][y] = true
				}
			} else { // dead
				if aliveCount == 3 {
					g.current[x][y] = true
					if !hasChange {
						hasChange = true
					}
				} else {
					g.current[x][y] = false
				}
			}
		}
	}
	if !hasChange { // no change in this round, game freeze
		g.frozen = true
	}
}

func main() {
	var err error

	args := os.Args[1:]
	if len(args) > 0 {
		rows, err = strconv.Atoi(args[0])
		if err != nil || rows <= 0 {
			log.Printf("Invalid rows %s, use default value", args[0])
		}
	}
	if len(args) > 1 {
		cols, err = strconv.Atoi(args[1])
		if err != nil || cols <= 0 {
			log.Printf("Invalid cols %s, use default value", args[1])
		}
	}

	g := newGame(rows, cols)
	g.run()
}
