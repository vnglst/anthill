/* @flow */
declare type ViewElement = { position: Vector, thing: Thing, phero: Phero }
declare type View = Array<ViewElement>

const createMatrix = (width: number, height: number, Default: Class<Empty> | Class<Phero>): Array<Array<Empty | Phero>> =>
  Array(width)
    .fill()
    .map((): Array<Empty | Phero> =>
      Array(height)
        .fill()
        .map((): Empty | Phero => new Default())
      )

class Grid {
  space: Array<Array<Phero | Empty>>
  width: number
  height: number
  constructor (width: number, height: number, Default: Class<Phero> | Class<Empty>) {
    this.width = width
    this.height = height
    this.space = createMatrix(width, height, Default)
  }
  get (position: Vector): Thing | Phero | Empty {
    if (position.x < 0 || position.x > this.width - 1 || position.y < 0 || position.y > this.height - 1) return undefined
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
        str += `${phero.food.toFixed(2)} `
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
  ants: Array<Ant>
  basePos: Vector
  constructor (width: number, height: number) {
    this.thingGrid = new ThingGrid(width, height, Empty)
    this.pheroGrid = new PheroGrid(width, height, Phero)
    this.basePos = new Vector(Math.round(width / 2), Math.round(height / 2))
    this.ants = []
  }
  createAnts (number: number) {
    for (let i = 0; i < number; i++) {
      this.ants.push(new Ant(this.basePos, this))
    }
  }
  turn () {
    this.ants.forEach((ant: Ant): void => ant.act())
  }
  set (position: Vector, thing: Thing) {
    if (thing) this.thingGrid.set(position, thing)
  }
  get (position: Vector): Thing | Empty {
    return this.thingGrid.get(position)
  }
  getView ({ position, radius }: {position: Vector, radius: number}): Array<{
    position: Vector,
    thing: Thing | Empty,
    phero: Phero
    }> {
    const view = []
    for (let x: number = -radius; x <= radius; x++) {
      for (let y: number = -radius; y <= radius; y++) {
        const newPosition = position.add(new Vector(x, y))
        const thing = this.thingGrid.get(newPosition)
        const phero = this.pheroGrid.get(newPosition)
        if (thing && phero) view.push({position: newPosition, phero, thing})
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
  constructor (
    danger: number = Math.random(),
    food: number = Math.random(),
    ant: number = Math.random()
  ) {
    this.danger = danger
    this.ant = ant
    this.food = food
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

export class Empty {
  description: string
  char: string
  constructor () {
    this.description = 'empty'
    this.char = '.'
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

export class Wall extends Thing {
  constructor (position: Vector, world: World) {
    super(position, world)
    this.description = 'Wall'
    this.char = '🚧'
    this.world.set(position, this)
  }
}

export class Ant extends Thing {
  position: Vector
  constructor (position: Vector, world: World) {
    super(position, world)
    this.description = 'Ant'
    this.char = '🐜'
    this.world.set(position, this)
  }
  getView (): View {
    return this.world.getView({position: this.position, radius: 1})
  }
  act () {
    const view = this.getView()
    const possibleMoves = this.filterPossible(view)
    if (possibleMoves.length) {
      let sorted = this.sortOn(possibleMoves, 'ant')
      sorted = this.sortOn(possibleMoves, 'danger')
      sorted = this.sortOn(possibleMoves, 'food')
      const newPosition = sorted[0].position
      this.moveTo(newPosition)
    }
  }
  filterPossible (view: View): View {
    return view.filter((viewElement: ViewElement): boolean => viewElement.thing instanceof Empty)
  }
  sortOn (view: View, what: string): View {
    return view.sort((a: ViewElement, b: ViewElement): number => a.phero[what] < b.phero[what] ? 1 : -1)
  }
  moveTo (newPosition: Vector) {
    const oldPosition = this.position
    this.position = newPosition
    this.world.set(newPosition, this)
    this.world.set(oldPosition, new Empty(oldPosition, this.world))
    const oldPhero = this.world.pheroGrid.get(oldPosition)
    const { food, ant, danger } = oldPhero
    if (food) {
      oldPhero.food -= 1
    } else if (danger) {
      oldPhero.danger -= 1
    } else if (ant) {
      oldPhero.ant += 1
    }
    this.world.pheroGrid.set(oldPosition, oldPhero)
  }
}
