const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-17.input'), 'ascii').trim()

assert.equal(run1(3), 638)

console.log('next value in buffer is', run1(parseInt(input, 10)))

console.log('value after 0 is', run2(parseInt(input, 10)))

function run1 (stepSize) {
  assert(stepSize > 0, 'must have a non-zero increment')
  const buffer = [0]
  let pos = 0
  for (let i = 0; i < 2017; i++) {
    pos = ((pos + stepSize) % buffer.length) + 1
    buffer.splice(pos, 0, i + 1)
  }
  return buffer[(pos + 1) % buffer.length]
}

function run2 (stepSize) {
  assert(stepSize > 0, 'must have a non-zero increment')
  let pos = 0
  let afterZero = 0
  let curLen = 0
  for (let i = 0; i < 50000000; i++) {
    curLen++
    pos = ((pos + stepSize) % curLen) + 1
    if (pos === 1) afterZero = i + 1
  }
  return afterZero
}
