const assert = require('assert')

const LEFT = Symbol('left')
const RIGHT = Symbol('right')

const STATES = {
  A: [ { write: 1, direction: RIGHT, next: 'B' },
       { write: 0, direction: RIGHT, next: 'C' } ],
  B: [ { write: 0, direction: LEFT, next: 'A' },
       { write: 0, direction: RIGHT, next: 'D' } ],
  C: [ { write: 1, direction: RIGHT, next: 'D' },
       { write: 1, direction: RIGHT, next: 'A' } ],
  D: [ { write: 1, direction: LEFT, next: 'E' },
       { write: 0, direction: LEFT, next: 'D' } ],
  E: [ { write: 1, direction: RIGHT, next: 'F' },
       { write: 1, direction: LEFT, next: 'B' } ],
  F: [ { write: 1, direction: RIGHT, next: 'A' },
       { write: 1, direction: RIGHT, next: 'E' } ]
}

assert.equal(
  run1(
    {
      A: [ { write: 1, direction: RIGHT, next: 'B' },
           { write: 0, direction: LEFT, next: 'B' } ],
      B: [ { write: 1, direction: LEFT, next: 'A' },
           { write: 1, direction: RIGHT, next: 'A' } ]
    },
    6
  ),
  3
)

console.log('checksum is', run1(STATES, 12368930), 'after 12368930 steps.')

function run1 (states, steps) {
  assert(steps > 0, 'must have some steps to run')
  const tape = new Map()

  let pos = 0
  let state = states['A']
  for (let i = 0; i < steps; i++) {
    let value = tape.get(pos) || 0
    tape.set(pos, state[value].write)
    if (state[value].direction === RIGHT) {
      pos += 1
    } else if (state[value].direction === LEFT) {
      pos -= 1
    }
    state = states[state[value].next]
  }

  return [...tape].reduce((a, c) => a + c[1], 0)
}
