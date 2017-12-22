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

// By taking advantage of the knowledge that the canvas is composed of tiles,
// and that the preparation process generates the entire inventory of tiles,
// this class is able to save a lot of memory and computation.
//
// This class exploits two key properties of the problem domain:
//
// 1. The contents of the tiles are immutable, so the canvas can store
//    references to the tiles instead of doing any allocation or copying. This
//    reduces memory consumption to O(sqrt(n / m)) per canvas, where n is the
//    full side * side length of the array and m is the side length of each
//    tile.
// 2. Both the full list of tiles and the tiles themselves can be stored as
//    simple linear arrays (or, in this case, an array of Buffers). Figuring
//    out the algorithm to translate from Cartesian coördinates is slightly
//    nontrivial, and involves a few division operations, but is otherwise
//    quite fast. All of the trickiness is confined to the get() and setTile()
//    operations, and overall this representation is much easier to deal with
//    than an arbitrary number of nested arrays.
//
// Additionally, one fairly simple optimization improves performance by
// reducing allocations and GC pressure: the extract operation needs to copy
// out a string extracted from the canvas in a way that may overlap one or two
// tiles. Instead of allocating a fresh buffer for each invocation, cache
// buffers for each size of extraction window and reuse it across invocations,
// being careful to overwrite all of the buffer's memory each time.
class TiledCanvas {
  constructor (tilesPerSide, tileSize) {
    this.tilesPerSide = tilesPerSide
    this.tileSize = tileSize
    this.side = tilesPerSide * tileSize
    this.tiles = new Array(tilesPerSide * tilesPerSide)
  }

  setTile (tileX, tileY, tile) {
    this.tiles[tileX + tileY * this.tilesPerSide] = tile
  }

  next (rules) {
    let tileSize
    if (this.side % 2 === 0) {
      tileSize = 3
    } else if (this.side % 3 === 0) {
      tileSize = 4
    } else throw new TypeError("don't know what to do with size " + this.side)
    const extractSize = tileSize - 1
    const tilesPerSide = this.side / extractSize
    const canvas = new TiledCanvas(tilesPerSide, tileSize)

    for (let y = 0; y < tilesPerSide; y++) {
      for (let x = 0; x < tilesPerSide; x++) {
        canvas.setTile(x, y, rules.get(this._extract(x, y, extractSize)))
      }
    }

    return canvas
  }

  popcnt () {
    let count = 0
    for (let tile of this.tiles) {
      count += tile.toString().replace(/\./g, '').length
    }
    return count
  }

  // 012    0123    012 012
  // 345    4567    345 345
  // 678 -> 89ab    678 678
  //        cdef ->
  //                012 012
  //                345 345
  //                678 678
  get (x, y) {
    let tileX = Math.floor(x / this.tileSize)
    let tileY = Math.floor(y / this.tileSize)
    let tileIndex = tileX + tileY * this.tilesPerSide

    let inX = x % this.tileSize
    let inY = y % this.tileSize
    let index = inX + inY * this.tileSize

    return this.tiles[tileIndex][index]
  }

  _extract (x, y, size) {
    let extracted = BUFFERS[size]
    for (let k = 0; k < size; k++) {
      for (let j = 0; j < size; j++) {
        extracted[k * size + j] = this.get(x * size + j, y * size + k)
      }
    }
    return extracted.toString()
  }
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

  let aht = new TiledCanvas(1, 3)
  aht.setTile(0, 0, Buffer.from(START.replace(/\n/g, ''), 'ascii'))
  for (let i = 0; i < iterations; i++) {
    aht = aht.next(rulebook)
  }

  return aht.popcnt()
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
