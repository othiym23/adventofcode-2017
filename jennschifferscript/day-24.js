const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-24.input'), 'ascii').trim()

assert.equal(
  run1(
    `0/2
     2/2
     2/3
     3/4
     3/5
     0/1
     10/1
     9/10`
  ),
  31
)

console.log('strongest bridge is', run1(input))

assert.equal(
  run2(
    `0/2
     2/2
     2/3
     3/4
     3/5
     0/1
     10/1
     9/10`
  ),
  19
)

console.log('strongest longest bridge is', run2(input))

function run1 (input) {
  const links = prepare(input)

  return findBridges(0, [], links).reduce((a, c) => a > c ? a : c, 0)

  function findBridges (pins, bridge, links) {
    const nexts = links.filter(p => p[0] === pins || p[1] === pins)
    if (nexts.length === 0) return bridgeStrength(bridge)

    const derivedStrengths = nexts.map(n => findBridges(n[0] === pins ? n[1] : n[0], bridge.concat([n]), links.filter(p => p !== n)))
    const flattened = [].concat(...derivedStrengths)
    return flattened
  }
}

function run2 (input) {
  const links = prepare(input)

  return findBridges(0, [], links).sort((a, b) => a.length === b.length ? b.strength - a.strength : b.length - a.length)[0].strength

  function findBridges (pins, bridge, links) {
    const nexts = links.filter(p => p[0] === pins || p[1] === pins)
    if (nexts.length === 0) return { strength: bridgeStrength(bridge), length: bridge.length }

    const derivedStrengths = nexts.map(n => findBridges(n[0] === pins ? n[1] : n[0], bridge.concat([n]), links.filter(p => p !== n)))
    return [].concat(...derivedStrengths)
  }
}

function bridgeStrength (list) {
  return list.reduce((a, c) => a + c[0] + c[1], 0)
}

function prepare (input) {
  return input.split(/\n/)
              .map(l => l.trim().split('/').map(e => parseInt(e, 10)).sort((a, b) => a - b))
}
