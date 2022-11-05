// @flow
/* eslint-env mocha */
import { describe, it } from 'mocha'
import { assert } from 'chai'
// import * as R from 'ramda'

import * as rnd from '../src/random'

describe('randNth', () => {
  it('should return nth element of list where nth is given by provided random ganerator', () => {
    const list = [1, 2, 3, 4, 5]
    list.forEach((n, i) => assert.equal(rnd.randNth(list, () => i / list.length), n))
  })
})

describe('randomByWeight', () => {
  const intConf = [{ id: 'one', weight: 1 }, { id: 'two', weight: 2 }, { id: 'three', weight: 3 }]
  // use 1.1 not 0.1 cause js 0.1 + 0.2 = 0.30000000000000004
  const floatConf = [{ id: 1, weight: 1.1 }, { id: 2, weight: 1.2 }, { id: 3, weight: 1.3 }]
  const randFunc = val => () => val
  const samples = [
    [intConf, 0, 'one'],
    [intConf, 1, 'two'],
    [intConf, 2, 'two'],
    [intConf, 3, 'three'],
    [intConf, 4, 'three'],
    [floatConf, 0, 1],
    [floatConf, 1.01, 1],
    [floatConf, 1.1, 2],
    [floatConf, 2.2, 2],
    [floatConf, 3.3, 3],
    [floatConf, 3.4, 3],
  ]
  samples.forEach(([conf, randVal, expected]) =>
    it(`case for randVal ${randVal} expected ${expected}`, () => {
      const actual = rnd.randomByWeight(conf, randFunc(randVal))
      assert.equal(actual, expected)
    }))
})
