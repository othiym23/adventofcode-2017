const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const stream = readFileSync(resolve(__dirname, '../inputs/day-09.input'), 'ascii').trim()

let garbageMode = false
let open = 0
let blocks = 0
let garbage = 0

for (let i = 0; i < stream.length; i++) {
  switch (stream[i]) {
    case '{':
      if (!garbageMode) open++
      else garbage++
      break
    case '}':
      if (!garbageMode) {
        assert(open > 0 || i === stream.length - 1, 'stream must have block parity')
        blocks += open
        open--
      } else {
        garbage++
      }
      break
    case '<':
      if (garbageMode) garbage++
      else garbageMode = true
      break
    case '>':
      garbageMode = false
      break
    case '!':
      i++
      break
    default:
      if (garbageMode) garbage++
  }
}

assert(open === 0, 'entire thing should be closed: ' + open)
console.log('block score of', blocks)
console.log('garbage was', garbage)
