const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-21.input'), 'ascii').trim()

const START = `.#.
               ..#
               ###`.split(/\n/).map(l => l.trim()).join('\n')

const BUFFERS = {
  2: makeSquare(2),
  3: makeSquare(3)
}

assert.equal(
  run(
    `../.# => ##./#../...
     .#./..#/### => #..#/..../..../#..#`,
    2
  ),
  12
)

console.log('%s dots active after 5 rounds using rulebook', run(input, 5))

console.log('%s dots active after 18 rounds using rulebook', run(input, 18))

function run (input, iterations) {
  const rulebook = prepare(input)

  let aht = Buffer.from(START.replace(/\n/g, ''), 'ascii')
  for (let i = 0; i < iterations; i++) {
    const side = Math.sqrt(aht.length)
    if (side % 2 === 0) {
      aht = enhance(aht, 2, rulebook)
    } else if (side % 3 === 0) {
      aht = enhance(aht, 3, rulebook)
    } else throw new Error("Don't know how to handle a square of size " + side)
  }

  return aht.toString().replace(/\./g, '').length
}

function enhance (source, s, rulebook) {
  const side = Math.sqrt(source.length)
  const steps = side / s
  const n = s + 1
  let out = makeSquare(steps * n)
  for (let y = 0; y < steps; y++) {
    for (let x = 0; x < steps; x++) {
      const replacement = rulebook.get(extract(source, s, x, y).toString())
      tile(out, replacement, x, y)
    }
  }
  return out
}

function extract (source, side, ox, oy) {
  const fullSide = Math.sqrt(source.length)
  let extracted = BUFFERS[side]
  for (let k = 0; k < side; k++) {
    for (let j = 0; j < side; j++) {
      extracted[k * side + j] = source[ox * side + j + (oy * side + k) * fullSide]
    }
  }
  return extracted
}

function tile (target, pattern, ox, oy) {
  const side = Math.sqrt(pattern.length)
  const increment = Math.sqrt(target.length) / side
  for (let k = 0; k < side; k++) {
    for (let j = 0; j < side; j++) {
      target[ox * side + j + (oy * side + k) * (side * increment)] = pattern[j + k * side]
    }
  }
}

function prepare (input) {
  const lines = input.split(/\n/).map(l => l.trim())
  const rulebook = new Map()
  for (let line of lines) {
    const variations = new Set()

    const [, lhs, rhs] = line.match(/^([.#/]+)\s+=>\s+([.#/]+)$/)
    const generator = rhs.replace(/\//g, '')
    let ir = Buffer.from(lhs.replace(/\//g, ''), 'ascii')
    let ri = reflect(ir)
    variations.add(ir.toString()); variations.add(ri.toString())
    for (let i = 0; i < 3; i++) {
      ir = rotate(ir)
      ri = rotate(ri)
      variations.add(ir.toString()); variations.add(ri.toString())
    }

    for (let pattern of variations) {
      assert(!rulebook.get(pattern), 'each variation must be unique')
      rulebook.set(pattern, Buffer.from(generator, 'ascii'))
    }
  }

  return rulebook
}

function reflect (ir) {
  const side = Math.sqrt(ir.length)
  let reflection = makeSquare(side)
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      reflection.writeUInt8(ir[side - x - 1 + y * side], x + y * side)
    }
  }
  return reflection
}

function rotate (ir) {
  const side = Math.sqrt(ir.length)
  let rotation = makeSquare(side)
  for (let i = 0; i < ir.length; i++) {
    let nx = side - Math.floor(i / side) - 1
    let ny = i % side
    rotation.writeUInt8(ir[i], nx + ny * side)
  }

  return rotation
}

function makeSquare (side) {
  return Buffer.alloc(side * side, '.')
}
