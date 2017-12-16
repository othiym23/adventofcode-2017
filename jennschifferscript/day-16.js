const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-16.input'), 'ascii').trim()

const PROGRAMS = 16
const ONE_BEELYUN = 1000 * 1000 * 1000

assert.equal(
  run1('s1,x3/4,pe/b', 5),
  'baedc'
)

console.log('Do-si-do: ', run1(input))

console.log("I think I'm gonna throw up: ", run2(input))

function run1 (input, size) {
  const programs = makePrograms(size)
  const instructions = prepare(input)
  for (let instruction of instructions) {
    let operands
    switch (instruction[0]) {
      case 's':
        spin(programs, parseInt(instruction.slice(1), 10))
        break
      case 'x':
        operands = instruction.slice(1).split('/')
        exchange(programs, parseInt(operands[0], 10), parseInt(operands[1], 10))
        break
      case 'p':
        operands = instruction.slice(1).split('/')
        partner(programs, operands[0], operands[1])
    }
  }
  return programs.join('')
}

function run2 (input, size) {
  const seen = []
  const programs = makePrograms(size)
  const instructions = prepare(input)
  for (let k = 0; k < ONE_BEELYUN; k++) {
    const sqwsh = programs.join('')
    if (seen.find(v => v === sqwsh)) {
      return seen[ONE_BEELYUN % k]
    }
    seen.push(sqwsh)
    for (let instruction of instructions) {
      let operands
      switch (instruction[0]) {
        case 's':
          spin(programs, parseInt(instruction.slice(1), 10))
          break
        case 'x':
          operands = instruction.slice(1).split('/')
          exchange(programs, parseInt(operands[0], 10), parseInt(operands[1], 10))
          break
        case 'p':
          operands = instruction.slice(1).split('/')
          partner(programs, operands[0], operands[1])
      }
    }
  }
  return programs.join('')
}

function spin (programs, size) {
  assert(size < programs.length, "can't rotate too far")
  const cut = programs.slice(-size)
  programs.splice(-size, size)
  programs.splice(0, 0, ...cut)
}

function partner (programs, p1, p2) {
  const i1 = programs.findIndex(v => v === p1)
  const i2 = programs.findIndex(v => v === p2)
  exchange(programs, i1, i2)
}

function exchange (programs, p1, p2) {
  assert(typeof p1 === 'number' && typeof p2 === 'number', 'operands must be numbers')
  const t = programs[p1]
  programs[p1] = programs[p2]
  programs[p2] = t
}

function prepare (input) {
  return input.split(',')
}

function makePrograms (size = PROGRAMS) {
  assert(size <= 26, 'only have so many lowercase letters, champ')
  let programs = []
  for (let i = 0; i < size; i++) programs.push(String.fromCodePoint(97 + i))
  return programs
}
