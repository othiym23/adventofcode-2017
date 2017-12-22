const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-22.input'), 'ascii').trim()

const UP = Symbol('up')
const DOWN = Symbol('down')
const LEFT = Symbol('left')
const RIGHT = Symbol('right')

const COMPASS = [ UP, RIGHT, DOWN, LEFT ]

const CLOCKWISE = 1
const REVERSE = 2
const WIDDERSHINS = 3

const POINTS = 4

const CLEAN = Symbol('Clean')
const WEAKENED = Symbol('Weakened')
const INFECTED = Symbol('Infected')
const FLAGGED = Symbol('Flagged')

assert.equal(
  run1(
    `..#
     #..
     ...`,
    10000
  ),
  5587
)

console.log('after 10,000 iterations, there were %s infections.', run1(input, 10000))

assert.equal(
  run2(
    `..#
     #..
     ...`,
    10000000
  ),
  2511944
)

console.log('after 10,000,000 iterations, there were %s infections.', run2(input, 10000000))

function run1 (input, bursts) {
  const grid = prepare1(input)
  let x = 0
  let y = 0
  let heading = 0 // COMPASS[0], or UP
  let infected = 0
  for (let i = 0; i < bursts; i++) {
    const coord = `${x},${y}`
    // 1. detect infection status / next direction
    if (grid.get(coord)) {
      heading = (heading + CLOCKWISE) % POINTS
    } else {
      infected++
      heading = (heading + WIDDERSHINS) % POINTS
    }

    // 2. toggle infection of current node
    grid.set(coord, !grid.get(coord))

    // 3. move
    switch (COMPASS[heading]) {
      case UP:
        y--
        break
      case DOWN:
        y++
        break
      case LEFT:
        x--
        break
      case RIGHT:
        x++
        break
      default:
        throw new TypeError('invalid heading ' + heading)
    }
  }

  return infected
}

function run2 (input, bursts) {
  const grid = prepare2(input)
  let x = 0
  let y = 0
  let heading = 0 // COMPASS[0], or UP
  let infected = 0
  for (let i = 0; i < bursts; i++) {
    const coord = `${x},${y}`
    // 1. detect infection status / next direction
    switch (grid.get(coord)) {
      case WEAKENED:
        // heading stays the same
        infected++
        grid.set(coord, INFECTED)
        break
      case INFECTED:
        heading = (heading + CLOCKWISE) % POINTS
        grid.set(coord, FLAGGED)
        break
      case FLAGGED:
        heading = (heading + REVERSE) % POINTS
        grid.set(coord, CLEAN)
        break
      default:
        // clean or unvisited coordinate
        heading = (heading + WIDDERSHINS) % POINTS
        grid.set(coord, WEAKENED)
    }

    // 3. move
    switch (COMPASS[heading]) {
      case UP:
        y--
        break
      case DOWN:
        y++
        break
      case LEFT:
        x--
        break
      case RIGHT:
        x++
        break
      default:
        throw new TypeError('invalid heading ' + heading)
    }
  }

  return infected
}

function prepare1 (input) {
  const grid = input.split(/\n/).map(l => l.trim().split(''))
  const centerX = Math.floor(grid[0].length / 2)
  const centerY = Math.floor(grid.length / 2)
  const sparse = new Map()
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') sparse.set(`${x - centerX},${y - centerY}`, true)
    }
  }

  return sparse
}

function prepare2 (input) {
  const grid = input.split(/\n/).map(l => l.trim().split(''))
  const centerX = Math.floor(grid[0].length / 2)
  const centerY = Math.floor(grid.length / 2)
  const sparse = new Map()
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') {
        sparse.set(`${x - centerX},${y - centerY}`, INFECTED)
      } else {
        sparse.set(`${x - centerX},${y - centerY}`, CLEAN)
      }
    }
  }

  return sparse
}
