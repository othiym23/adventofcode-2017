const assert = require('assert')
const readFileSync = require('fs').readFileSync

const HEX_COMPASS = ['n', 'ne', 'se', 's', 'sw', 'nw']

assert.equal(run('ne,ne,ne').distance, 3)
assert.equal(run('ne,ne,sw,sw').distance, 0)
assert.equal(run('ne,ne,s,s').distance, 2)
assert.equal(run('se,sw,se,sw,sw').distance, 3)

const path = readFileSync('./day-11.txt', 'ascii').trim()
console.log('path is', run(path).distance, 'steps long.')
console.log('max distance was', run(path).maxDistance + '.')

function run (input) {
  return walk(prepare(input))
}

function prepare (input) {
  assert.equal(typeof input, 'string')
  return input.split(',')
}

function walk (path) {
  const record = new Map(HEX_COMPASS.map(direction => [direction, 0]))

  let maxDistance = 0
  let distance = 0

  path.forEach(step => {
    takeStep(record, step)
    distance = [...record.values()].reduce((a, s) => a + s)
    maxDistance = Math.max(distance, maxDistance)
  })

  return { distance, maxDistance }
}

function takeStep (record, step) {
  const direction = HEX_COMPASS.findIndex(a => a === step)
  assert(direction >= 0, "can't find direction for step " + step)

  const forward = HEX_COMPASS[direction]
  const upright = HEX_COMPASS[(direction + 1) % HEX_COMPASS.length]
  const downright = HEX_COMPASS[(direction + 2) % HEX_COMPASS.length]
  const backward = HEX_COMPASS[(direction + 3) % HEX_COMPASS.length]
  const downleft = HEX_COMPASS[(direction + 4) % HEX_COMPASS.length]
  const upleft = HEX_COMPASS[(direction + 5) % HEX_COMPASS.length]

  if (record.get(backward) > 0) {
    record.set(backward, record.get(backward) - 1)
  } else if (record.get(downright) > 0 && record.get(downleft) > 0) {
    record.set(downright, record.get(downright) - 1)
    record.set(downleft, record.get(downleft) - 1)
  } else if (record.get(downright) > 0) {
    record.set(downright, record.get(downright) - 1)
    record.set(upright, record.get(upright) + 1)
  } else if (record.get(downleft) > 0) {
    record.set(downleft, record.get(downleft) - 1)
    record.set(upleft, record.get(upleft) + 1)
  } else {
    record.set(forward, record.get(forward) + 1)
  }
}
