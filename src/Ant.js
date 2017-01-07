/* @flow */
'use strict'

type GridType = Array<Array<Thing>>

const createMatrix = (width: number, height: number, Default: any): GridType =>
    Array(width)
      .fill()
      .map((): Array<Thing> =>
      Array(height)
        .fill(new Default()))

export class World {
  width: number
  height: number
  grid: GridType
  add: Function
  moveTo: Function
  get: Function
  toStr: Function
  getView: Function

  constructor (width: number, height: number) {
    this.width = width
    this.height = height
    this.grid = createMatrix(width, height, Empty)
  }
}

World.prototype.add = function (thing: Thing) {
  if (thing) this.grid[thing.x][thing.y] = thing
}

World.prototype.moveTo = function (thing: Thing, newX: number, newY: number) {
  if (thing) {
    thing.x = newX
    thing.y = newY
    this.grid[newX][newY] = thing
  }
}

World.prototype.get = function (x: number, y: number): ?Thing {
  if (x < 0 || x > this.width || y < 0 || y > this.height) return null
  return this.grid[x][y]
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
  let str: string = ''
  this.grid.forEach((column: Array<Object>) => {
    str += '\n'
    column.forEach((thing: Thing) => {
      str += thing.char
    })
  })
  return str
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
