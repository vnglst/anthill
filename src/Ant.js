/* @flow */

export const generateWorld = function (): Array<Array<null | Wall | Ant>> {
  return [
    [null, null, null, null, null],
    [null, new Wall(), null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
  ]
}

export const Wall = function () { }

export const Ant = function (x: number, y: number) {
  this.x = x
  this.y = y
}

Ant.prototype.getView = function (world: Array<Array<any>>): Array<any> {
  return world[this.x][this.y]
}
