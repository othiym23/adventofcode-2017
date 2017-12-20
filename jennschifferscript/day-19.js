const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-19.input'), 'ascii')

const UP = Symbol('UP')
const DOWN = Symbol('DOWN')
const LEFT = Symbol('LEFT')
const RIGHT = Symbol('RIGHT')

assert.equal(
  run1(
    '     |         \n' +
    '     |  +--+   \n' +
    '     A  |  C   \n' +
    ' F---|----E|--+\n' +
    '     |  |  |  D\n' +
    '     +B-+  +--+'
  ),
  'ABCDEF'
)

console.log('visited sequence is %s', run1(input))

assert.equal(
  run2(
    '     |         \n' +
    '     |  +--+   \n' +
    '     A  |  C   \n' +
    ' F---|----E|--+\n' +
    '     |  |  |  D\n' +
    '     +B-+  +--+'
  ),
  38
)
console.log('took %s steps', run2(input))

function run1 (input) {
  const maze = prepare(input)
  const visitacion = []
  let direction = DOWN
  let y = 0
  let x = maze[y].split('').findIndex(c => c.match(/[|+-]/))
  let la
  while (true) {
    switch (direction) {
      case DOWN:
        y++
        break
      case UP:
        y--
        break
      case RIGHT:
        x++
        break
      case LEFT:
        x--
        break
    }

    la = (maze[y] || [])[x]

    if (la === undefined || la === ' ') return visitacion.join('')

    if (la === '+') {
      if (direction === DOWN || direction === UP) {
        if ((maze[y] || [])[x + 1] === undefined || (maze[y] || [])[x + 1] === ' ') {
          direction = LEFT
        } else if ((maze[y] || [])[x - 1] === undefined || maze[y][x - 1] === ' ') {
          direction = RIGHT
        } else {
          throw new TypeError('ran outta road, chief')
        }
      } else {
        if ((maze[y + 1] || [])[x] === undefined || (maze[y + 1] || [])[x] === ' ') {
          direction = UP
        } else if ((maze[y - 1] || [])[x] === undefined || (maze[y - 1] || [])[x] === ' ') {
          direction = DOWN
        } else {
          throw new TypeError('ran outta road, chief')
        }
      }
    } else if (la.match(/[A-Z]/)) {
      visitacion.push(la)
    } else if (la === ' ') {
      throw new TypeError('fell off the maze')
    }
  }
}

function run2 (input) {
  const maze = prepare(input)
  let direction = DOWN
  let y = 0
  let x = maze[y].split('').findIndex(c => c.match(/[|+-]/))
  let la
  let steps = 1
  while (true) {
    switch (direction) {
      case DOWN:
        y++
        break
      case UP:
        y--
        break
      case RIGHT:
        x++
        break
      case LEFT:
        x--
        break
    }

    la = (maze[y] || [])[x]

    if (la === undefined || la === ' ') return steps

    steps++

    if (la === '+') {
      if (direction === DOWN || direction === UP) {
        if ((maze[y] || [])[x + 1] === undefined || (maze[y] || [])[x + 1] === ' ') {
          direction = LEFT
        } else if ((maze[y] || [])[x - 1] === undefined || maze[y][x - 1] === ' ') {
          direction = RIGHT
        } else {
          throw new TypeError('ran outta road, chief')
        }
      } else {
        if ((maze[y + 1] || [])[x] === undefined || (maze[y + 1] || [])[x] === ' ') {
          direction = UP
        } else if ((maze[y - 1] || [])[x] === undefined || (maze[y - 1] || [])[x] === ' ') {
          direction = DOWN
        } else {
          throw new TypeError('ran outta road, chief')
        }
      }
    }
  }
}

function prepare (input) {
  return input.split(/\n/)
}
