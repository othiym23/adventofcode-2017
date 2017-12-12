const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const provided = readFileSync(resolve(__dirname, '../inputs/day-05.input'), 'ascii').trim()

let instructions = provided.split(/\n/).map(v => parseInt(v, 10))

let pos = 0
let steps = 0

while (true) {
  const offset = instructions[pos]
  if (offset !== undefined) {
    instructions[pos]++
    pos += offset
  } else {
    break
  }
  steps++
}

console.log('escaped the maze the first time in %d steps', steps)

pos = 0
steps = 0

instructions = provided.split(/\n/).map(v => parseInt(v, 10))

while (true) {
  const offset = instructions[pos]
  if (offset !== undefined) {
    if (offset >= 3) {
      // console.log('- s: %s p: %s o: %s', steps, pos, offset)
      instructions[pos]--
    } else {
      // console.log('+ s: %s p: %s o: %s', steps, pos, offset)
      instructions[pos]++
    }
    pos += offset
  } else {
    break
  }
  steps++
}

console.log('escaped the maze the second time in %d steps', steps)
