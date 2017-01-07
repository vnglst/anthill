/* @flow */

type ThingType = Wall | Ant | Void
type WorldType = Array<Array<ThingType>>

// Refactor this using .fill from ES6
const createMatrix = (width: number, height: number, DefaultValue: any): Array<Array<any>> => {
  const arr = []
  // Creates all lines:
  for (let i = 0; i < width; i++) {
    // Creates an empty line
    arr.push([])
    // Adds cols to the empty line:
    arr[i].push(new Array(height))
    for (let j = 0; j < height; j++) {
      // Initializes:
      arr[i][j] = new DefaultValue(i, j)
    }
  }
  return arr
}

export const World = function (width: number, height: number) {
  this.width = width
  this.height = height
  const grid: WorldType = createMatrix(width, height, Void)
  this.grid = grid
}

World.prototype.add = function (thing: ThingType) {
  if (thing) this.grid[thing.x][thing.y] = thing
}

World.prototype.moveTo = function (thing: ThingType, newX: number, newY: number) {
  if (thing) {
    thing.x = newX
    thing.y = newY
    this.grid[newX][newY] = thing
  }
}

World.prototype.get = function (x: number, y: number): ?ThingType {
  if (x < 0 || x > this.width || y < 0 || y > this.height) return null
  return this.grid[x][y]
}

World.prototype.getView = function (xCor: number, yCor: number, radius: number): Array<ThingType> {
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
  this.grid.forEach((column: Array<ThingType>) => {
    str += '\n'
    column.forEach((thing: ThingType) => {
      str += thing.char
    })
  })
  return str
}

export const Wall = function (x: number, y: number) {
  this.x = x
  this.y = y
  this.description = 'Wall'
  this.char = '#'
}

export const Void = function (x: number, y: number) {
  this.x = x
  this.y = y
  this.description = 'Void'
  this.char = '_'
}

export const Ant = function (x: number, y: number) {
  this.x = x
  this.y = y
  this.description = 'Ant'
  this.char = 'o'
}
