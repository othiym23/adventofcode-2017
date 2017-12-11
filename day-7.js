const readFileSync = require('fs').readFileSync
const assert = require('assert')

let vertices = readFileSync('./day-7-vertices.txt', 'ascii').trim().split(/\n/)

const edges = new Map()
const weights = new Map()
const totalWeights = new Map()
const rhs = new Set()

// part 1: find root
for (let vertex of vertices) {
  const [below, above] = vertex.split(/ -> /)
  const [, name, weight] = below.match(/(.+) \((\d+)\)/)
  if (above) {
    const children = above.split(/, /)
    children.forEach(t => rhs.add(t))
    edges.set(name, children)
  }
  weights.set(name, parseInt(weight, 10))
}

let root
for (let name of weights.keys()) {
  if (!rhs.has(name)) {
    assert(!root, 'only one root')
    root = name
  }
}

console.log('root node is', root)

// part 2: find the outlier node, starting from the root
traverse(root, 0)
findOutlier(root)

function traverse (node) {
  let totalWeight = weights.get(node)
  assert(totalWeight > 0, 'must have weight for ' + node)

  const children = edges.get(node)
  if (children) {
    for (let child of children) {
      totalWeight += traverse(child)
    }
  }

  totalWeights.set(node, totalWeight)
  return totalWeight
}

function findOutlier (node) {
  let children = edges.get(node)
  if (children) {
    const inverted = new Map()
    children.forEach(c => {
      const weight = totalWeights.get(c)
      if (!inverted.get(weight)) inverted.set(weight, [])
      inverted.get(weight).push(c)
    })

    const reduced = Array.from(inverted.entries())
    if (reduced.length === 1) {
      return false
    } else {
      const [outlierWeight, [badChild]] = reduced.find(p => p[1].length === 1)
      const [normalWeight] = reduced.find(p => p[1].length > 1)
      if (!findOutlier(badChild)) {
        const difference = normalWeight - outlierWeight
        const badWeight = weights.get(badChild)
        console.log('corrected weight should be', badWeight + difference)
      }
      return true
    }
  }
}
