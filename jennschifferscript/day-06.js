const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const provided = readFileSync(resolve(__dirname, '../inputs/day-06.input'), 'ascii').trim()

const BANKS = provided.split(/\s+/).map(v => parseInt(v, 10))

console.log('the solution to part 1 is', part1(BANKS))
console.log('the solution to part 2 is', part2(BANKS))

function currentConfig (memory) {
  return memory.join(' ')
}

function findMax (arry) {
  let curIndex = 0
  let curMax = arry[0]

  for (let i = 1; i < arry.length; i++) {
    if (arry[i] > curMax) {
      curIndex = i
      curMax = arry[i]
    }
  }
  return curIndex
}

function rebalance (a) {
  const biggest = findMax(a)
  const size = a[biggest]
  a[biggest] = 0
  for (let i = 0; i < size; i++) {
    a[(biggest + i + 1) % a.length]++
  }
}

function part1 (initial) {
  let turns = 1
  let working = Array.from(initial)
  let seen = new Set()

  while (true) {
    seen.add(currentConfig(working))
    rebalance(working)
    if (seen.has(currentConfig(working))) break
    turns++
  }

  return turns
}

function part2 (initial) {
  let turns = 1
  let working = Array.from(initial)
  let seen = new Set()
  let cycleStart

  while (true) {
    seen.add(currentConfig(working))
    rebalance(working)
    if (seen.has(currentConfig(working))) {
      cycleStart = currentConfig(working)
      break
    }
    turns++
  }

  turns = 1
  while (true) {
    rebalance(working)
    if (currentConfig(working) === cycleStart) break
    turns++
  }

  return turns
}
