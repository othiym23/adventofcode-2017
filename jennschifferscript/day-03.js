const assert = require('assert')

module.exports = solve

const RIGHT = Symbol('RIGHT')
const UP = Symbol('UP')
const LEFT = Symbol('LEFT')
const DOWN = Symbol('DOWN')

function generate (turn) {
  const size = turn * 2 - 1
  assert(size > 0, 'must have a positive size')

  let square = new Array(size)
  for (let i = 0; i < size; i++) {
    square[i] = new Array(size).fill(0)
  }
  return square
}

function visitor (arry, x, y) {
  let sum = 0
  // turn in the same order used by the visiting algorithm
  sum += (arry[y + 1] || [])[x] || 0
  sum += (arry[y + 1] || [])[x + 1] || 0
  sum += (arry[y] || [])[x + 1] || 0
  sum += (arry[y - 1] || [])[x + 1] || 0
  sum += (arry[y - 1] || [])[x] || 0
  sum += (arry[y - 1] || [])[x - 1] || 0
  sum += (arry[y] || [])[x - 1] || 0
  sum += (arry[y + 1] || [])[x - 1] || 0

  return sum
}

function populate (goal, square, visit) {
  const size = square.length
  const center = Math.floor(size / 2)

  let x = center
  let y = center

  // start from center
  square[y][x] = 1

  let direction = RIGHT

  function goAround (turn) {
    const min = center - turn + 1
    const max = center + turn - 1
    while (true) {
      switch (direction) {
        case RIGHT:
          if (x === max) {
            if (y === min) {
              return 0
            } else {
              direction = UP
              y += 1
            }
          } else {
            x += 1
          }
          break
        case UP:
          if (y === max) {
            direction = LEFT
            x -= 1
          } else {
            y += 1
          }
          break
        case LEFT:
          if (x === min) {
            direction = DOWN
            y -= 1
          } else {
            x -= 1
          }
          break
        case DOWN:
          if (y === min) {
            direction = RIGHT
            x += 1
          } else {
            y -= 1
          }
          break
        default:
          console.error('bad direction!')
      }

      const value = visit(square, x, y)
      square[y][x] = value
      if (value > goal) {
        return value
      }
    }
  }

  for (let turn = 2; turn <= (size + 1) / 2; turn++) {
    const found = goAround(turn)
    if (found) return found
  }
}

function solve (goal) {
  let turn = 0
  let square = []

  while (true) {
    turn++
    square = generate(turn)
    const found = populate(goal, square, visitor)
    if (found) return found
  }
}
