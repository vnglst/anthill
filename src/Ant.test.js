/* @flow */
/* eslint-env jest */

import { World, Wall, Ant, Empty, Vector } from './Ant'

describe('Creating a world', () => {
  const world = new World(10, 20)

  it('It should be a world', () => {
    expect(world).toBeInstanceOf(World)
  })

  it('It should contain a grid, with ', () => {
    expect(world.thingGrid).toBeDefined()
    expect(world.get(new Vector(5, 5))).toBeInstanceOf(Empty)
  })

  const ant1 = new Ant(new Vector(2, 2))
  world.set(new Vector(2, 2), ant1)
  it('It should contain an Ant', () => {
    expect(world.get(new Vector(2, 2))).toBeInstanceOf(Ant)
  })

  const wall1 = new Wall(2, 1)
  world.set(new Vector(2, 1), wall1)
  it('It should contain a Wall', () => {
    expect(world.get(new Vector(2, 1))).toBeInstanceOf(Wall)
  })

  console.log('World: ', world.toStr())
  console.log('View: ', world.getView({position: new Vector(2, 2), radius: 2}))
})

