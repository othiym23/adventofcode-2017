const assert = require('assert')
const readFileSync = require('fs').readFileSync

const SIZE = 256
const ROUNDS = 64

assert.equal(run(''), 'a2582a3a0e66e6e86e3812dcb672a272')
assert.equal(run('AoC 2017'), '33efeb34ea91902bb2f59c9920caa6cd')
assert.equal(run('1,2,3'), '3efbe78a8d82f29979031a4aa0b16a9d')
assert.equal(run('1,2,4'), '63960835bcdc130f0b66d7ff4f6a5a8e')

const provided = readFileSync('./day-10.txt', 'ascii').trim()
console.log('hash value is', run(provided))

function run (input) {
  return toOutput(aFrayedKnot(prepare(input)))
}

function prepare (input) {
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

function aFrayedKnot (lengths) {
  const ring = buildRing(SIZE)

  let pos = 0
  let skipSize = 0

  for (let i = 0; i < ROUNDS; i++) {
    lengths.forEach(length => {
      permute(ring, pos, length)
      pos = (pos + length + skipSize) % SIZE
      skipSize++
    })
  }

  return ring
}

function permute (r, p, l) {
  assert(l < r.length, "can't permute more elements than exist in the list")
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
  for (let e = 0; e < SIZE; e++) ring[e] = e
  return ring
}
