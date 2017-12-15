const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-15.input'), 'ascii').trim()

const MODULUS = 2147483647
const FACTOR_A = 16807
const PICKINESS_A = 4
const FACTOR_B = 48271
const PICKINESS_B = 8
const MASK = 0xFFFF

const ITER1 = 40 * 1000 * 1000
const ITER2 = 5 * 1000 * 1000

assert.equal(
  run1(
    `Generator A starts with 65
     Generator B starts with 8921`
  ),
  588
)

console.log('The judge found %s matches from plain generators.', run1(input))

assert.equal(
  run2(
    `Generator A starts with 65
     Generator B starts with 8921`
  ),
  309
)

console.log('The judge found %s matches from picky generators.', run2(input))

function prepare (provided) {
  const [, seedA] = provided.match(/Generator A starts with (\d+)/)
  const [, seedB] = provided.match(/Generator B starts with (\d+)/)
  return { seedA, seedB }
}

function * stream (seed, factor, pickiness) {
  let cur = seed
  while (true) {
    cur = (cur * factor) % MODULUS
    if (!pickiness || cur % pickiness === 0) yield cur
  }
}

function run1 (provided) {
  const { seedA, seedB } = prepare(provided)
  const genA = stream(seedA, FACTOR_A)
  const genB = stream(seedB, FACTOR_B)

  let count = 0
  for (let i = 0; i < ITER1; i++) {
    const nextA = genA.next().value
    const nextB = genB.next().value
    if ((nextA & MASK) === (nextB & MASK)) count++
  }
  return count
}

function run2 (provided) {
  const { seedA, seedB } = prepare(provided)
  const genA = stream(seedA, FACTOR_A, PICKINESS_A)
  const genB = stream(seedB, FACTOR_B, PICKINESS_B)

  let count = 0
  for (let i = 0; i < ITER2; i++) {
    const nextA = genA.next().value
    const nextB = genB.next().value
    if ((nextA & MASK) === (nextB & MASK)) count++
  }
  return count
}
