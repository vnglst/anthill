/* @flow */
/* eslint-env jest */

import { World, Wall, Ant, Empty, Vector, Phero } from './Ant'

describe('Creating a world', () => {
  const world = new World(10, 20)

  it('should be a world', () => {
    expect(world).toBeInstanceOf(World)
  })

  it('should contain a grid, with ', () => {
    expect(world.thingGrid).toBeDefined()
    expect(world.get(new Vector(5, 5))).toBeInstanceOf(Empty)
  })

  const ant1 = new Ant(new Vector(2, 2), world)
  describe('Adding an ant', () => {
    it('should contain an Ant', () => {
      expect(world.get(new Vector(2, 2))).toBeInstanceOf(Ant)
      expect(world.get(new Vector(2, 2))).toEqual(ant1)
    })
  })

  const wall1 = new Wall(new Vector(2, 1), world)
  describe('Adding a wall', () => {
    it('should contain a Wall', () => {
      expect(world.get(new Vector(2, 1))).toBeInstanceOf(Wall)
      expect(world.get(new Vector(2, 1))).toEqual(wall1)
    })
  })

  describe('Testing world.getView', () => {
    const view = world.getView({position: new Vector(2, 2), radius: 1})
    it('should contain 9 elements', () => {
      expect(view).toHaveLength(9)
    })

    it('should contain contain an Ant with position 2, 2', () => {
      expect(view[4].thing).toBeInstanceOf(Ant)
      expect(view[4].position).toBeInstanceOf(Vector)
      expect(view[4].position).toEqual(new Vector(2, 2))
      expect(view[4].phero).toBeInstanceOf(Phero)
    })
  })

  describe('Testing ant.getView', () => {
    const view = ant1.getView()
    it('should contain 9 elements', () => {
      expect(view).toHaveLength(9)
    })

    it('should contain contain the ant with position 2, 2', () => {
      expect(view[4].thing).toBeInstanceOf(Ant)
      expect(view[4].position).toBeInstanceOf(Vector)
      expect(view[4].position).toEqual(new Vector(2, 2))
      expect(view[4].phero).toBeInstanceOf(Phero)
    })
  })

  describe('Testing ant.possibleMoves', () => {
    it('should list only possibleMoves', () => {
      const view = ant1.getView()
      const possibleMoves = ant1.filterPossible(view)
      expect(possibleMoves).toHaveLength(7)
    })
  })

  describe('Testing ant.moveTo', () => {
    it('should have moved the ant', () => {
      const moveTo = new Vector(3, 3)
      ant1.moveTo(moveTo)
      expect(world.get(moveTo)).toEqual(ant1)
    })
  })

  describe('Testing ant.act', () => {
    it('should have moved to another position', () => {
      ant1.act()
      console.log(world.toStr())
    })
  })
})

