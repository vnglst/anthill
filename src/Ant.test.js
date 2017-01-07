/* @flow */
/* eslint-env jest */

import { World, Wall, Ant, Empty } from './Ant'

describe('Creating a world', () => {
  const world = new World(10, 20)

  it('It should be a world', () => {
    expect(world).toBeInstanceOf(World)
  })

  it('It should contain a grid, with ', () => {
    expect(world.grid).toBeDefined()
    expect(world.grid[5][5]).toBeInstanceOf(Empty)
  })

  const ant1 = new Ant(2, 2)
  world.add(ant1)
  it('It should contain an Ant', () => {
    expect(world.grid[2][2]).toBeInstanceOf(Ant)
  })

  const wall1 = new Wall(2, 1)
  world.add(wall1)
  it('It should contain a Wall', () => {
    expect(world.grid[2][1]).toBeInstanceOf(Wall)
  })

  console.log(world.toStr())
  console.log(world.getView(0, 0, 2))
})

