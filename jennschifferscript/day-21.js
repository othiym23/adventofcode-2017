const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-21.input'), 'ascii').trim()

const START = `.#.
               ..#
               ###`.split(/\n/).map(l => l.trim()).join('\n')

assert.equal(
  run1(
    `../.# => ##./#../...
     .#./..#/### => #..#/..../..../#..#`,
    2
  ),
  12
)

console.log('%s dots active after 5 rounds using rulebook', run1(input, 5))

console.log('%s dots active after 18 rounds using rulebook', run1(input, 18))

function run1 (input, iterations) {
  const rulebook = prepare(input)

  let aht = START.split(/\n/).map(r => r.split(''))
  for (let i = 0; i < iterations; i++) {
    if (aht.length % 2 === 0) {
      const steps = aht.length / 2
      const out = squarify(steps * 3)
      for (let y = 0; y < steps; y++) {
        for (let x = 0; x < steps; x++) {
          const extracted = [
            aht[y * 2].slice(x * 2, x * 2 + 2),
            aht[y * 2 + 1].slice(x * 2, x * 2 + 2)
          ].map(r => r.join('')).join('')
          const replacement = rulebook.get(extracted)
          for (let j = 0; j < 3; j++) {
            out[y * 3 + j].splice(x * 3, 3, ...replacement[j])
          }
        }
      }
      aht = out
    } else if (aht.length % 3 === 0) {
      const steps = aht.length / 3
      const out = squarify(steps * 4)
      for (let y = 0; y < steps; y++) {
        for (let x = 0; x < steps; x++) {
          const extracted = [
            aht[y * 3].slice(x * 3, x * 3 + 3),
            aht[y * 3 + 1].slice(x * 3, x * 3 + 3),
            aht[y * 3 + 2].slice(x * 3, x * 3 + 3)
          ].map(r => r.join('')).join('')
          const replacement = rulebook.get(extracted)
          for (let j = 0; j < 4; j++) {
            out[y * 4 + j].splice(x * 4, 4, ...replacement[j])
          }
        }
      }
      aht = out
    } else throw new Error("Don't know how to handle a square of size " + aht.length)
  }

  return aht.map(r => r.join('')).join('').split('').filter(e => e === '#').length
}

function prepare (input) {
  const lines = input.split(/\n/).map(l => l.trim())
  const rulebook = new Map()
  for (let line of lines) {
    const variations = new Set()

    const [, lhs, rhs] = line.match(/^([.#/]+)\s+=>\s+([.#/]+)$/)
    const generator = rhs.split(/\//).map(r => r.split(''))
    let ir = lhs.split('/')
    let ri = reflect(ir)
    variations.add(ir.join('')); variations.add(ri.join(''))
    for (let i = 0; i < 3; i++) {
      ir = rotate(ir)
      ri = rotate(ri)
      variations.add(ir.join('')); variations.add(ri.join(''))
    }

    for (let pattern of variations) {
      assert(!rulebook.get(pattern), 'each variation must be unique')
      rulebook.set(pattern, generator)
    }
  }

  return rulebook
}

function reflect (ir) {
  const reflection = []
  for (let row of ir) {
    reflection.push(row.split('').reverse().join(''))
  }
  return reflection
}

function rotate (ir) {
  const len = ir.length * ir.length
  const lr = ir.map(r => r.split(''))
  let out = squarify(ir.length)
  for (let i = 0; i < len; i++) {
    let x = i % ir.length
    let y = Math.floor(i / ir.length)
    let nx = ir.length - y - 1
    let ny = x
    out[ny][nx] = lr[y][x]
  }

  return out.map(r => r.join(''))
}

function squarify (size) {
  return new Array(size).fill(0).map(r => new Array(size).fill('.'))
}
