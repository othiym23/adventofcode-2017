const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-18.input'), 'ascii').trim()

assert.equal(
  run1(
    `set a 1
     add a 2
     mul a a
     mod a 5
     snd a
     set a 0
     rcv a
     jgz a -1
     set a 1
     jgz a -2`
  ),
  4
)

console.log('recovered frequency is', run1(input))

console.log('sent %s values', run2(input))

function run1 (input) {
  const instructions = prepare(input)
  const registers = new Map()
  let freq = 0
  let pos = 0
  while (pos < instructions.length) {
    const [operation, op1, op2] = instructions[pos].split(/\s+/)
    switch (operation) {
      case 'snd':
        freq = getValue(op1)
        break
      case 'set':
        registers.set(op1, getValue(op2))
        break
      case 'add':
        registers.set(op1, getValue(op1) + getValue(op2))
        break
      case 'mul':
        registers.set(op1, getValue(op1) * getValue(op2))
        break
      case 'mod':
        registers.set(op1, getValue(op1) % getValue(op2))
        break
      case 'rcv':
        if (getValue(op1) !== 0) return freq
        break
      case 'jgz':
        if (getValue(op1) > 0) pos += getValue(op2) - 1
        break
      default:
        throw new TypeError(operation + ' is not a valid day-18 operation')
    }
    pos++
  }

  function getValue (operand) {
    if (operand.match(/^[a-z]$/)) return registers.get(operand) || 0
    return parseInt(operand, 10)
  }
}

function run2 (input) {
  const instructions = prepare(input)

  let registers = [new Map(), new Map()]
  let channel = [[], []]
  let blocking = [false, false]
  let sent = [0, 0]

  let p0 = process(instructions, { id: 0, registers, channel, blocking, sent })
  let p1 = process(instructions, { id: 1, registers, channel, blocking, sent })

  while (true) {
    p0.next()
    p1.next()
    if (blocking[0] === true && blocking[1] === true) break
  }

  return sent[1]
}

function * process (instructions, state) {
  const { id, registers, channel, blocking, sent } = state

  let pos = 0
  registers[id].set('p', id)

  while (true) {
    const [operation, op1, op2] = instructions[pos].split(/\s+/)
    switch (operation) {
      case 'set':
        registers[id].set(op1, getValue(op2))
        break
      case 'add':
        registers[id].set(op1, getValue(op1) + getValue(op2))
        break
      case 'mul':
        registers[id].set(op1, getValue(op1) * getValue(op2))
        break
      case 'mod':
        registers[id].set(op1, getValue(op1) % getValue(op2))
        break
      case 'jgz':
        if (getValue(op1) > 0) pos += getValue(op2) - 1
        break
      case 'snd':
        channel[(id + 1) % 2].push(getValue(op1))
        sent[id]++
        break
      case 'rcv':
        if (channel[id].length === 0) {
          blocking[id] = true
          while (true) {
            if (channel[id].length === 0) yield
            else {
              blocking[id] = false
              break
            }
          }
          continue
        }
        registers[id].set(op1, channel[id].shift())
        break
      default:
        throw new TypeError(operation + ' is not a valid day-18 operation')
    }
    assert(pos < instructions.length, "can't branch off to infinity: " + pos)
    assert(pos >= 0, "can't branch off to negativland: " + pos)
    pos++
    yield
  }

  function getValue (operand) {
    if (operand.match(/^[a-z]$/)) return registers[id].get(operand) || 0
    return parseInt(operand, 10)
  }
}

function prepare (input) {
  return input.split(/\n/).map(l => l.trim())
}
