const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const provided = readFileSync(resolve(__dirname, '../inputs/day-13.input'), 'ascii').trim()

assert.equal(
  run1(
    `0: 3
     1: 2
     4: 4
     6: 4`
  ),
  24
)

assert(sweep(1, 1))
assert(sweep(0, 2))
assert(!sweep(5, 3))

console.log('Severity of default incursion is %s.', run1(provided))

assert.equal(
  run2(
    `0: 3
     1: 2
     4: 4
     6: 4`
  ),
  10
)

console.log('Safe start time is %s.', run2(provided))

function run1 (input) {
  const scanners = prepare(input)

  let sev = 0
  for (let layer of scanners.keys()) {
    const t = layer
    const depth = scanners.get(layer)
    if (sweep(t, depth)) sev += layer * depth
  }
  return sev
}

function run2 (input) {
  const scanners = prepare(input)
  let start = 0
  while (true) {
    if (!caught(scanners, start)) return start
    start++
  }
}

function caught (scanners, start) {
  for (let layer of scanners.keys()) {
    const t = layer + start
    const depth = scanners.get(layer)
    if (sweep(t, depth)) return true
  }
  return false
}

function sweep (t, d) {
  assert(t >= 0, 'must have a positive time')
  assert(d > 0, 'must have a positive depth')
  if (d === 1) return true
  return (t % (2 * (d - 1))) === 0
}

function prepare (input) {
  return new Map(input.split(/\n/).map(l => l.trim().split(': ').map(v => parseInt(v, 10))))
}
