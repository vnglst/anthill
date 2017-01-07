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
  constructor (width: number, height: number, Default: any) {
    this.space = createMatrix(width, height, Default)
  }
  get (x: number, y: number): Object {
    return this.space[x][y]
  }
  set (x: number, y: number, obj: Object) {
    this.space[x][y] = obj
  }
}

class PheroGrid extends Grid {
  toStr: Function
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
  toStr: Function
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
  width: number
  height: number
  thingGrid: ThingGrid
  pheroGrid: PheroGrid
  set: Function
  get: Function
  toStr: Function
  getView: Function

  constructor (width: number, height: number) {
    this.width = width
    this.height = height
    this.thingGrid = new ThingGrid(width, height, Empty)
    this.pheroGrid = new PheroGrid(width, height, Phero)
  }
}

World.prototype.set = function (thing: Thing) {
  if (thing) this.thingGrid.set(thing.x, thing.y, thing)
}

World.prototype.get = function (x: number, y: number): ?Thing {
  if (x < 0 || x > this.width || y < 0 || y > this.height) return null
  return this.thingGrid.get(x, y)
}

World.prototype.getView = function (xCor: number, yCor: number, radius: number): Array<Thing> {
  const view = []
  for (let x: number = -radius; x <= radius; x++) {
    for (let y: number = -radius; y <= radius; y++) {
      const thing = this.get(xCor + x, yCor + y)
      if (thing) view.push(thing)
    }
  }
  return view
}

World.prototype.toStr = function (): string {
  return this.thingGrid.toStr() + '\n\n' + this.pheroGrid.toStr()
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

export class Thing {
  x: number
  y: number
  description: string
  char: string
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
    this.description = 'empty'
    this.char = '_'
  }
}

export class Empty extends Thing { }

export class Ant extends Thing {
  constructor (x: number, y: number) {
    super(x, y)
    this.description = 'Ant'
    this.char = 'o'
  }
}

export class Wall extends Thing {
  constructor (x: number, y: number) {
    super(x, y)
    this.description = 'Wall'
    this.char = '0'
  }
}
