const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const provided = readFileSync(resolve(__dirname, '../inputs/day-12.input'), 'ascii').trim()

assert.equal(
  run1(`0 <-> 2
        1 <-> 1
        2 <-> 0, 3, 4
        3 <-> 2, 4
        4 <-> 2, 3, 6
        5 <-> 6
        6 <-> 4, 5`),
  6
)

console.log('ROOT is connected to', run1(provided), 'programs.')

assert.equal(
  run2(`0 <-> 2
        1 <-> 1
        2 <-> 0, 3, 4
        3 <-> 2, 4
        4 <-> 2, 3, 6
        5 <-> 6
        6 <-> 4, 5`),
  2
)

console.log('There are', run2(provided), 'program groups total.')

function run1 (input) {
  const graph = prepare1(input)
  const seen = new Set()
  const ROOT = '0'

  seen.add(ROOT)
  visit(ROOT, seen, graph)

  return seen.size
}

function run2 (input) {
  const graph = prepare1(input)
  const globalSeen = new Set()
  const groups = new Set()

  for (let lh of graph.keys()) {
    if (!globalSeen.has(lh)) {
      globalSeen.add(lh)
      const newGroup = new Set()
      newGroup.add(lh)
      groups.add(newGroup)
      visitWithGlobal(lh, newGroup, globalSeen, graph)
    }
  }

  return groups.size
}

function visit (node, seen, graph) {
  for (let nxt of graph.get(node).values()) {
    if (!seen.has(nxt)) {
      seen.add(nxt)
      visit(nxt, seen, graph)
    }
  }
}

function visitWithGlobal (node, seen, globalSeen, graph) {
  for (let nxt of graph.get(node).values()) {
    if (!seen.has(nxt)) {
      globalSeen.add(nxt)
      seen.add(nxt)
      visitWithGlobal(nxt, seen, globalSeen, graph)
    }
  }
}

function prepare1 (input) {
  const old = input.split(/\n/).map(l => l.trim().split(' <-> ')).map(l => [l[0], l[1].split(', ')])
  const lessOld = new Map()
  for (let [lh, rhs] of old) lessOld.set(lh, new Set(rhs))
  return lessOld
}
