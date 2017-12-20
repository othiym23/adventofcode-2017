const assert = require('assert')
const readFileSync = require('fs').readFileSync
const resolve = require('path').resolve

const input = readFileSync(resolve(__dirname, '../inputs/day-20.input'), 'ascii').trim()

assert.equal(
  run1(
    `p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
     p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>`
  ),
  0
)

console.log('id of slowest particle is %s.', run1(input))

assert.equal(
  run2(
    `p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>
     p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
     p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
     p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>`
  ),
  1
)

console.log('there are %s particles left after 10000 iterations of the system.', run2(input))

function run1 (input) {
  const particles = prepare(input)
  let minID
  let minAcc = Infinity
  for (let p of particles) {
    let acc = Math.sqrt(
      Math.pow(Math.abs(p.a.x), 2) +
      Math.pow(Math.abs(p.a.y), 2) +
      Math.pow(Math.abs(p.a.z), 2)
    )
    if (acc < minAcc) {
      minID = p.id
      minAcc = acc
    }
  }

  return minID
}

function run2 (input) {
  let particles = prepare(input)
  for (let t = 0; t < 10000; t++) {
    // check for "collisions"
    let locations = new Map()
    for (let p of particles) {
      const loc = [p.p.x, p.p.y, p.p.z].join(',')
      if (!locations.get(loc)) {
        locations.set(loc, [p.id])
      } else {
        locations.get(loc).push(p.id)
      }
    }
    let removeList = []
    for (let [, points] of locations) {
      if (points.length < 2) continue
      removeList = removeList.concat(points)
    }
    const remove = new Set(removeList)
    particles = particles.filter(p => !remove.has(p.id))

    // iterate the system
    for (let p of particles) {
      p.v.x += p.a.x; p.v.y += p.a.y; p.v.z += p.a.z
      p.p.x += p.v.x; p.p.y += p.v.y; p.p.z += p.v.z
    }
  }

  return particles.length
}

function prepare (input) {
  return input.split(/\n/).map((l, id) => {
    const [, px, py, pz, vx, vy, vz, ax, ay, az] =
      l.match(/p=<\s*([0-9-]+),([0-9-]+),([0-9-]+)>, v=<\s*([0-9-]+),([0-9-]+),([0-9-]+)>, a=<\s*([0-9-]+),([0-9-]+),([0-9-]+)>/)
    return {
      id,
      p: { x: parseInt(px, 10), y: parseInt(py, 10), z: parseInt(pz, 10) },
      v: { x: parseInt(vx, 10), y: parseInt(vy, 10), z: parseInt(vz, 10) },
      a: { x: parseInt(ax, 10), y: parseInt(ay, 10), z: parseInt(az, 10) }
    }
  })
}
