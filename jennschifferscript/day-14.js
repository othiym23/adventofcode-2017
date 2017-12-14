const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const key = readFileSync(resolve(__dirname, '../inputs/day-14.input'), 'ascii').trim()

const ROWS = 128
const SIZE = 256
const ROUNDS = 64

function UnionFind (width, height) {
  assert(width > 0, 'must have width')
  assert(height > 0, 'must have height')

  this.id = new Array(width * height)
  for (let i = 0; i < width * height; i++) this.id[i] = i
}

UnionFind.prototype.union = function (p, q) {
  let i = this.find(p)
  let j = this.find(q)

  if (i === j) return

  if (i < j) {
    this.id[i] = j
  } else {
    this.id[j] = i
  }
}

UnionFind.prototype.find = function (p) {
  while (p !== this.id[p]) {
    this.id[p] = this.id[this.id[p]]
    p = this.id[p]
  }

  return p
}

UnionFind.prototype.connected = function (p, q) {
  return this.find(p) === this.find(q)
}

assert.equal(run1('flqrgnkx'), 8108)

console.log('popcount of key is', run1(key))

assert.equal(run2('flqrgnkx', 8108), 1242)

console.log('there are %s distinct groups', run2(key))

function run1 (key) {
  let pop = 0
  for (let i = 0; i < ROWS; i++) {
    let hash = toOutput(aFrayedKnot(key + '-' + i))
    pop += hash.match(/../g).reduce((a, v) => a + popcnt32(parseInt(v, 16)), 0)
  }
  return pop
}

function run2 (key, safetyCount) {
  const bitmap = new Array(ROWS)
  const labels = new Array(ROWS)

  const regions = new UnionFind(ROWS, ROWS)
  let minLabel = 1

  // pass 1: label all the regions, populate the union
  for (let y = 0; y < ROWS; y++) {
    let knot = aFrayedKnot(key + '-' + y)
    bitmap[y] = densify(knot).reduce((a, v) => a + ('000000000' + v.toString(2)).substr(-8), '')
    labels[y] = new Array(ROWS).fill(0)
    for (let x = 0; x < ROWS; x++) {
      if (bitmap[y][x] === '1') {
        const west = bitmap[y][x - 1]
        const north = (bitmap[y - 1] || [])[x]
        const westLabel = labels[y][x - 1]
        const northLabel = (labels[y - 1] || [])[x]

        let id
        if (north === '1' && west === '1') {
          if (westLabel === northLabel) {
            id = westLabel
          } else {
            let [min, max] = [westLabel, northLabel].sort((l, r) => l - r)
            id = min
            regions.union(max, min)
          }
        } else if (north === '1') {
          id = northLabel
        } else if (west === '1') {
          id = westLabel
        } else {
          id = minLabel++
        }

        labels[y][x] = id
      }
    }
  }

  console.log('populated grid for key', key)
  dumpBitmap(bitmap)

  console.log('labeled regions for key', key)
  dumpLabels(labels)

  // pass 2: relabel based on the union, tracking the leftover regions
  const relabeled = new Array(ROWS)
  const allRegions = new Set()

  for (let r = 0; r < ROWS; r++) {
    relabeled[r] = new Array(ROWS).fill(0)
  }
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < ROWS; x++) {
      const found = regions.find(labels[x][y])
      relabeled[x][y] = found
      allRegions.add(found)
    }
  }

  console.log('unified regions for key', key)
  dumpLabels(relabeled)

  return allRegions.size - 1
}

function toOutput (knot) {
  return Buffer.from(densify(knot)).toString('hex')
}

function densify (knot) {
  let dense = new Array(16)
  for (let i = 0; i < 16; i++) {
    let dh = 0
    for (let j = 0; j < 16; j++) dh = dh ^ knot[i * 16 + j]
    dense[i] = dh
  }
  return dense
}

function aFrayedKnot (input) {
  assert.equal(typeof input, 'string')

  function buildRing (size) {
    const ring = new Array(size)
    for (let e = 0; e < size; e++) ring[e] = e
    return ring
  }

  function permute (r, p, l) {
    assert(l <= r.length, "can't permute more elements than exist in the list.")
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

  const lengths = input.split('').map(e => e.codePointAt(0)).concat([17, 31, 73, 47, 23])
  const ring = buildRing(SIZE)

  let pos = 0
  let skipSize = 0

  for (let i = 0; i < ROUNDS; i++) {
    for (let length of lengths) {
      permute(ring, pos, length)
      pos = (pos + length + skipSize) % SIZE
      skipSize++
    }
  }

  return ring
}

// taken from https://stackoverflow.com/questions/43122082/efficiently-count-the-number-of-bits-in-an-integer-in-javascript
function popcnt32 (n) {
  n = n - ((n >> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

function dumpBitmap (bitmap) {
  for (let i = 0; i < ROWS; i++) {
    let line = ''
    for (let j = 0; j < ROWS; j++) {
      line += bitmap[i][j] === '1' ? '#' : '.'
    }
    console.log(line)
  }
  console.log()
}

function dumpLabels (labels) {
  const values = 'ZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY'.split('')
  for (let i = 0; i < ROWS; i++) {
    let line = ''
    for (let j = 0; j < ROWS; j++) {
      const label = labels[i][j]
      line += label === 0 ? '.' : values[label % values.length]
    }
    console.log(line)
  }
  console.log()
}
