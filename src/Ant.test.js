/* @flow */
/* eslint-env jest */

import { World, Wall, Ant } from './Ant'

describe('Creating a world', () => {
  const world = new World(10, 20)

  it('should create an Ant', () => {
    expect(world).toBeInstanceOf(World)
  })
  const ant1 = new Ant(2, 2)
  const wall1 = new Wall(2, 1)
  world.add(ant1)
  world.add(wall1)
  console.log(world.toStr())
  console.log(world.getView(0, 0, 2))
})

