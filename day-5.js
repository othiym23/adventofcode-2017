const readFileSync = require('fs').readFileSync

let instructions = readFileSync('./day-5-instruction-list.txt', 'ascii').trim().split(/\n/).map(v => parseInt(v, 10))

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

console.log('escaped the maze in %d steps', steps)

pos = 0
steps = 0

instructions = readFileSync('./day-5-instruction-list.txt', 'ascii').trim().split(/\n/).map(v => parseInt(v, 10))

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

console.log('escaped the maze in %d steps', steps)
