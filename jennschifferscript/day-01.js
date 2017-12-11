const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-01.input'), 'ascii').trim()

assert.equal(run1('1122'), 3)
assert.equal(run1('1111'), 4)
assert.equal(run1('1234'), 0)
assert.equal(run1('91212129'), 9)

console.log('the solution to part 1 is', run1(input))

assert.equal(run2('1212'), 6)
assert.equal(run2('1221'), 0)
assert.equal(run2('123425'), 4)
assert.equal(run2('123123'), 12)
assert.equal(run2('12131415'), 4)

console.log('the solution to part 2 is', run2(input))

function run1 (captcha) {
  const length = captcha.length
  let solution = 0
  for (let i = 0; i < length; i++) {
    let digit = parseInt(captcha[i], 10)
    let next = parseInt(captcha[(i + 1) % length], 10)
    if (digit === next) solution += digit
  }

  return solution
}

function run2 (captcha) {
  const length = captcha.length
  const half = Math.floor(captcha.length / 2)
  let decaptcha = 0

  for (let i = 0; i < captcha.length; i++) {
    const digit = parseInt(captcha[i], 10)
    const next = parseInt(captcha[(i + half) % length], 10)
    if (digit === next) decaptcha += digit
  }
  return decaptcha
}
