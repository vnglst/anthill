/* @flow */
'use strict'

declare type View = Array<{ position: Vector, thing: ?Thing, phero: ?Phero }>

const createMatrix = (width: number, height: number, Default: any): Array<Array<any>> =>
  Array(width)
    .fill()
    .map((): Array<Thing> =>
      Array(height)
        .fill(new Default()))

class Grid {
  space: Array<Array<Phero | Thing>>
  width: number
  height: number
  constructor (width: number, height: number, Default: Class<Phero> | Class<Thing>) {
    this.width = width
    this.height = height
    this.space = createMatrix(width, height, Default)
  }
  get (position: Vector): ?Object {
    if (position.x < 0 || position.x > this.width || position.y < 0 || position.y > this.height) return undefined
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
  getView ({ position, radius }: {position: Vector, radius: number}): Array<{
    position: Vector,
    thing: ?Thing,
    phero: ?Phero
    }> {
    const view = []
    for (let x: number = -radius; x <= radius; x++) {
      for (let y: number = -radius; y <= radius; y++) {
        const newPosition = position.add(new Vector(x, y))
        const thing = this.thingGrid.get(newPosition)
        const phero = this.pheroGrid.get(newPosition)
        if (thing !== undefined) view.push({position: newPosition, phero, thing})
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
  position: Vector
  world: World
  constructor (position: Vector, world: World) {
    this.description = 'not set'
    this.char = 'not defined'
    this.world = world
    this.position = position
  }
}

export class Empty extends Thing {
  constructor (position: Vector, world: World) {
    super(position, world)
    this.description = 'empty'
    this.char = '.'
    this.world = world
    this.position = position
  }
}

export class Wall extends Thing {
  constructor (position: Vector, world: World) {
    super(position, world)
    this.description = 'Wall'
    this.char = 'W'
    this.world.set(position, this)
  }
}

export class Ant extends Thing {
  position: Vector
  constructor (position: Vector, world: World) {
    super(position, world)
    this.description = 'Ant'
    this.char = 'A'
    this.world.set(position, this)
  }
  getView (): View {
    return this.world.getView({position: this.position, radius: 1})
  }
}
