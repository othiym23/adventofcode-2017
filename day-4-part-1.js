const fs = require('fs')

const passphrases = fs.readFileSync('./day-4-passphrase-list.txt', 'ascii').trim().split(/\n/)

console.log('length', passphrases.length)

let count = 0

for (let phrase of passphrases) {
  const words = new Set()
  let valid = true
  for (let word of phrase.split(/\s+/)) {
    if (words.has(word)) {
      valid = false
    } else {
      words.add(word)
    }
  }
  if (valid) count++
}

console.log('no repeated words', count)

count = 0

for (let phrase of passphrases) {
  const words = new Set()
  let valid = true
  for (let word of phrase.split(/\s+/)) {
    word = word.split('').sort().join('')
    if (words.has(word)) {
      valid = false
    } else {
      words.add(word)
    }
  }
  if (valid) count++
}

console.log('no repeated anagrams', count)
