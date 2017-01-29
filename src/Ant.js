/* @flow */
'use strict'

const createMatrix = (width: number, height: number, Default: any): Array<Array<any>> =>
  Array(width)
    .fill()
    .map((): Array<Thing> =>
      Array(height)
        .fill(new Default()))

class Grid {
  space: Array<Array<any>>
  width: number
  height: number
  constructor (width: number, height: number, Default: any) {
    this.width = width
    this.height = height
    this.space = createMatrix(width, height, Default)
  }
  get (position: Vector): ?Object {
    if (position.x < 0 || position.x > this.width || position.y < 0 || position.y > this.height) return null
    return this.space[position.x][position.y]
  }
  set (position: Vector, obj: Object) {
    this.space[position.x][position.y] = obj
  }
}

class PheroGrid extends Grid {
  toStr (): string {
    let str: string = ''
    this.space.forEach((column: Array<Object>) => {
      str += '\n'
      column.forEach((phero: Phero) => {
        str += `${phero.ant.toFixed(2)} `
      })
    })
    return str
  }
}

class ThingGrid extends Grid {
  toStr (): string {
    let str: string = ''
    this.space.forEach((column: Array<Object>) => {
      str += '\n'
      column.forEach((thing: Thing) => {
        str += thing.char
      })
    })
    return str
  }
}

export class World {
  thingGrid: ThingGrid
  pheroGrid: PheroGrid
  constructor (width: number, height: number) {
    this.thingGrid = new ThingGrid(width, height, Empty)
    this.pheroGrid = new PheroGrid(width, height, Phero)
  }
  set (position: Vector, thing: Thing) {
    if (thing) this.thingGrid.set(position, thing)
  }
  get (position: Vector): ?Thing {
    return this.thingGrid.get(position)
  }
  getView ({ position, radius }: {position: Vector, radius: number}): Array<Thing> {
    const view = []
    for (let x: number = -radius; x <= radius; x++) {
      for (let y: number = -radius; y <= radius; y++) {
        const v: Vector = new Vector(x, y)
        const thing = this.thingGrid.get(position.add(v))
        const phero = this.pheroGrid.get(position.add(v))
        if (thing) view.push({x, y, ...phero, ...thing})
      }
    }
    return view
  }
  toStr (): string {
    return this.thingGrid.toStr() + '\n\n' + this.pheroGrid.toStr()
  }
}

export class Phero {
  danger: number
  ant: number
  food: number
  constructor () {
    this.danger = Math.random() * 10
    this.ant = Math.random() * 10
    this.food = Math.random() * 10
  }
}

export class Vector {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
  add (vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
}

export class Thing {
  description: string
  char: string
  constructor () {
    this.description = 'empty'
    this.char = '.'
  }
}

export class Empty extends Thing { }

export class Wall extends Thing {
  constructor () {
    super()
    this.description = 'Wall'
    this.char = '0'
  }
}

export class Ant extends Thing {
  position: Vector
  constructor (position: Vector) {
    super()
    this.position = position
    this.description = 'Ant'
    this.char = 'o'
  }
}
