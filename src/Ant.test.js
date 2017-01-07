/* @flow */
/* eslint-env jest */

import { Ant, Wall, generateWorld } from './Ant'

const world = generateWorld()

it('should create an Ant', () => {
  const ant = new Ant(2, 2)
  expect(ant).toBeInstanceOf(Ant)

  it('getView should return a view', () => {
    const view = ant.getView(world)
    expect(view).toBeInstanceOf(Wall)
  })
})
