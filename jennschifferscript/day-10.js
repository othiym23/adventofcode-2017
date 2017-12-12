const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const provided = readFileSync(resolve(__dirname, '../inputs/day-10.input'), 'ascii').trim()

const SIZE = 256
const ROUNDS = 64

assert.equal(run1('3,4,1,5', 5), 12)

console.log('first hash code is', run1(provided, SIZE))

assert.equal(run2(''), 'a2582a3a0e66e6e86e3812dcb672a272')
assert.equal(run2('AoC 2017'), '33efeb34ea91902bb2f59c9920caa6cd')
assert.equal(run2('1,2,3'), '3efbe78a8d82f29979031a4aa0b16a9d')
assert.equal(run2('1,2,4'), '63960835bcdc130f0b66d7ff4f6a5a8e')

console.log('second hash value is', run2(provided))

function run1 (input, size) {
  const ring = aFrayedKnot(prepare1(input), size, 1)
  return ring[0] * ring[1]
}

function prepare1 (input) {
  return input.split(',').map(v => parseInt(v, 10))
}

function run2 (input) {
  return toOutput(aFrayedKnot(prepare2(input), SIZE, ROUNDS))
}

function prepare2 (input) {
  assert.equal(typeof input, 'string')
  return input.split('').map(e => e.codePointAt(0)).concat([17, 31, 73, 47, 23])
}

function toOutput (knot) {
  let dense = new Array(16)
  for (let i = 0; i < 16; i++) {
    let dh = 0
    for (let j = 0; j < 16; j++) dh = dh ^ knot[i * 16 + j]
    dense[i] = dh
  }
  return Buffer.from(dense).toString('hex')
}

function aFrayedKnot (lengths, size, rounds) {
  const ring = buildRing(size)

  let pos = 0
  let skipSize = 0

  for (let i = 0; i < rounds; i++) {
    lengths.forEach(length => {
      permute(ring, pos, length)
      pos = (pos + length + skipSize) % size
      skipSize++
    })
  }

  return ring
}

function permute (r, p, l) {
  assert(l <= r.length, "can't permute more elements than exist in the list (" + l + ' requested of list ' + require('util').inspect(r) + ')')
  const pivot = Math.floor(l / 2)
  for (let i = 0; i < pivot; i++) {
    let near = (p + i) % r.length
    let far = (p + l - i - 1) % r.length

    // swap
    let t = r[near]
    r[near] = r[far]
    r[far] = t
  }
}

function buildRing (size) {
  const ring = new Array(size)
  for (let e = 0; e < size; e++) ring[e] = e
  return ring
}
