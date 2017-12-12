const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-02.input'), 'ascii').trim()

assert.equal(
  run1(`5 1 9 5
        7 5 3
        2 4 6 8`),
  18
)

console.log('the solution to part 1 is', run1(input))

assert.equal(
  run2(`5 9 2 8
        9 4 7 3
        3 8 6 5`),
  9
)

console.log('the solution to part 2 is', run2(input))

function prepare (input) {
  return input.split(/\n/).map(row => row.trim().split(/\s+/).map(e => parseInt(e, 10)))
}

function run1 (spreadsheet) {
  const table = prepare(spreadsheet)
  const maxes = table.map(row => Math.max(...row))
  const mins = table.map(row => Math.min(...row))

  return maxes.reduce((acc, curr, ind) => curr - mins[ind] + acc, 0)
}

function evenDivisor (arr) {
  for (let j = 0; j < arr.length; j++) {
    for (let k = 0; k < arr.length; k++) {
      if (j === k) {
        continue
      } else if ((arr[j] % arr[k]) === 0) {
        return arr[j] / arr[k]
      }
    }
  }
}

function run2 (spreadsheet) {
  const table = prepare(spreadsheet)
  return table.map(evenDivisor).reduce((a, c) => a + c)
}
