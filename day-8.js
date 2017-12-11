const readFileSync = require('fs').readFileSync
const assert = require('assert')

let instructions = readFileSync('./day-8-program.txt', 'ascii').trim().split(/\n/)

const registers = new Map()
let globalBiggest = 0

for (let instruction of instructions) {
  const [, register, direction, amount, condition] = instruction.match(/^([a-z]+) (dec|inc) (-?\d+) if (.+)$/)
  assert(register, 'must have register to alter for ' + instruction)
  assert(direction, 'must have direction to alter for ' + instruction)
  assert(amount, 'must have amount to change for ' + instruction)
  assert(condition, 'must have condition to check for ' + instruction)

  const [, target, predicate, value] = condition.match(/^([a-z]+) (<|>|<=|>=|==|!=) (-?\d+)$/)
  assert(target, 'must have condition register for ' + instruction)
  assert(predicate, 'must have known predicate  for ' + instruction)
  assert(value, 'must have condition value for ' + instruction)

  // evaluate condition
  let registerValue = registers.get(target)
  if (registerValue === undefined) registerValue = 0
  let status

  switch (predicate) {
    case '<':
      status = registerValue < parseInt(value, 10)
      break
    case '>':
      status = registerValue > parseInt(value, 10)
      break
    case '<=':
      status = registerValue <= parseInt(value, 10)
      break
    case '>=':
      status = registerValue >= parseInt(value, 10)
      break
    case '==':
      status = registerValue === parseInt(value, 10)
      break
    case '!=':
      status = registerValue !== parseInt(value, 10)
      break
    default:
      throw new TypeError('expected an operator, got ' + predicate)
  }

  if (status) {
    let currentValue = registers.get(register)
    if (currentValue === undefined) currentValue = 0
    globalBiggest = currentValue > globalBiggest ? currentValue : globalBiggest

    switch (direction) {
      case 'dec':
        currentValue -= parseInt(amount, 10)
        break
      case 'inc':
        currentValue += parseInt(amount, 10)
        break
      default:
        throw new TypeError('expected "inc" or "dec", got ' + direction)
    }

    registers.set(register, currentValue)
  }
}

const biggest = [...registers.entries()].reduce((a, c) => a[1] > c[1] ? a : c)

console.log('biggest value is', biggest[1], '(of', biggest[0] + ')')
console.log('highest register value at any point was', globalBiggest)
