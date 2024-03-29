// @flow
/* eslint-env mocha */
import { describe, it } from 'mocha'
import { assert } from 'chai'

import * as Color from '../src/color'

describe('allChannelMatrixes', () => {
  it('0 case', () => {
    assert.deepEqual(Color.allChannelMatrixes(0, false), [
      { r: 0, g: 0, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
    ])

    assert.deepEqual(Color.allChannelMatrixes(0, true), [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 255, b: 255 },
    ])
  })

  it('1 case', () => {
    assert.deepEqual(Color.allChannelMatrixes(1, false), [
      { r: 0, g: 0, b: 127 },
      { r: 0, g: 0, b: 255 },
      { r: 0, g: 127, b: 0 },
      { r: 0, g: 127, b: 127 },
      { r: 0, g: 127, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 255, b: 127 },
      { r: 0, g: 255, b: 255 },
      { r: 127, g: 0, b: 0 },
      { r: 127, g: 0, b: 127 },
      { r: 127, g: 0, b: 255 },
      { r: 127, g: 127, b: 0 },
      { r: 127, g: 127, b: 255 },
      { r: 127, g: 255, b: 0 },
      { r: 127, g: 255, b: 127 },
      { r: 127, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 127 },
      { r: 255, g: 0, b: 255 },
      { r: 255, g: 127, b: 0 },
      { r: 255, g: 127, b: 127 },
      { r: 255, g: 127, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 255, b: 127 },
    ])

    assert.deepEqual(Color.allChannelMatrixes(1, true), [
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 127 },
      { r: 0, g: 0, b: 255 },
      { r: 0, g: 127, b: 0 },
      { r: 0, g: 127, b: 127 },
      { r: 0, g: 127, b: 255 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 255, b: 127 },
      { r: 0, g: 255, b: 255 },
      { r: 127, g: 0, b: 0 },
      { r: 127, g: 0, b: 127 },
      { r: 127, g: 0, b: 255 },
      { r: 127, g: 127, b: 0 },
      { r: 127, g: 127, b: 127 },
      { r: 127, g: 127, b: 255 },
      { r: 127, g: 255, b: 0 },
      { r: 127, g: 255, b: 127 },
      { r: 127, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 0, b: 127 },
      { r: 255, g: 0, b: 255 },
      { r: 255, g: 127, b: 0 },
      { r: 255, g: 127, b: 127 },
      { r: 255, g: 127, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 255, b: 127 },
      { r: 255, g: 255, b: 255 },
    ])
  })

  it('2 case', () => {
    const result1 = Color.allChannelMatrixes(2, false)
    assert.equal(result1.length, 120)
    const result2 = Color.allChannelMatrixes(2, true)
    assert.equal(result2.length, 125)
  })
})
