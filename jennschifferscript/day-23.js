const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-23.input'), 'ascii').trim()

const SET = Symbol('set')
const SUB = Symbol('sub')
const MUL = Symbol('mul')
const JNZ = Symbol('jnz')

const OPS = {
  'set': SET,
  'sub': SUB,
  'mul': MUL,
  'jnz': JNZ
}

console.log('multiplied %s values', run1(input))

console.log('register h has value %s.', run2(input))

function run1 (input) {
  const instructions = prepare(input)

  let registers = new Map()
  let multiplied = 0

  let pos = 0
  'abcdefgh'.split('').forEach(r => registers.set(r, 0))

  while (pos < instructions.length && pos >= 0) {
    const [operation, op1, op2] = instructions[pos]
    switch (operation) {
      case SET:
        registers.set(op1, getValue(op2))
        break
      case SUB:
        registers.set(op1, getValue(op1) - getValue(op2))
        break
      case MUL:
        registers.set(op1, getValue(op1) * getValue(op2))
        multiplied++
        break
      case JNZ:
        if (getValue(op1) !== 0) pos += getValue(op2) - 1
        break
      default:
        throw new TypeError(operation + ' is not a valid day-23 operation')
    }
    pos++
  }

  return multiplied

  function getValue (operand) {
    if (operand.match(/^[a-z]$/)) return registers.get(operand) || 0
    return parseInt(operand, 10)
  }
}

//     ;;; INITIALIZATION
//     set b 93      ; b := 93
//     set c b       ; c := 93
//     jnz a A       ; skip setup when 'a' is initialized to 1
//     jnz 1 B
//
//     ;;; PROD SETUP
// A:  mul b 100
//     sub b -100000 ; b := 109300
//     set c b
//     sub c -17000  ; c := 126300
//
//     ;;; CORE LOOP
// B:  set f 1       ; f := 1
//     set d 2       ; d := 2
// E:  set e 2       ; e := 2
// D:  set g d
//     mul g e
//     sub g b
//     jnz g C
//     set f 0       ; if (d * e) = b then f := 0
// C:  sub e -1      ; inc e
//     set g e
//     sub g b
//     jnz g D
//     sub d -1      ; if e = b then inc d else goto D
//     set g d
//     sub g b
//     jnz g E       ; if d != b then goto E
//     jnz f F
//     sub h -1      ; if (d * e) = b @ 21 then inc h else goto F
// F:  set g b
//     sub g c
//     jnz g G
//     jnz 1 DONE    ; if b = c then break
// G:  sub b -17     ; b := b + 17
//     jnz 1 B
// DONE
//
// 'a': only used to switch between debug and prod modes
// 'b': initialized to the value 109300 -- lower bound
//      incremented by 17 at the end of each loop
// 'c': initialized to the value 126300 -- upper bound
//      when b = c, program is finished
// 'd': initialized to 2 at loop begin
//      increments when e = b
// 'e': initialized to 2 at loop begin
//      increments each time through main loop
// 'f': set to 1 at the beginning of each loop
//      set to 0 when d * e = b -- b is not prime
// 'g': main working register
// 'h': incremented when b is not prime
function run2 (ignored) {
  let h = 0
  for (let i = 109300; i <= 126300; i += 17) {
    if (!isPrime(i)) h++
  }
  return h

  function isPrime (n) {
    if (n === leastFactor(n)) return true
    return false
  }

  function leastFactor (n) {
    if (n === 0) return 0
    if (n % 1 || n * n < 2) return 1
    if (n % 2 === 0) return 2
    if (n % 3 === 0) return 3
    if (n % 5 === 0) return 5

    const m = Math.sqrt(n)
    for (let i = 7; i <= m; i += 30) {
      if (n % i === 0) return i
      if (n % (i + 4) === 0) return i + 4
      if (n % (i + 6) === 0) return i + 6
      if (n % (i + 10) === 0) return i + 10
      if (n % (i + 12) === 0) return i + 12
      if (n % (i + 16) === 0) return i + 16
      if (n % (i + 22) === 0) return i + 22
      if (n % (i + 24) === 0) return i + 24
    }
    return n
  }
}

function prepare (input) {
  return input.split(/\n/).map(l => l.trim()).map(l => {
    const [operation, op1, op2] = l.split(/\s+/)
    return [OPS[operation], op1, op2]
  })
}
