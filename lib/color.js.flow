// @flow
import * as R from 'ramda'
import { int as randInt } from 'random'
// import random from 'random'

type Byte = number // 0 -- 255
export type ChannelMatrix = { r: Byte, g: Byte, b: Byte }
export type RGBArray = [Byte, Byte, Byte]

export const matrixToRGB = ({ r, g, b }: ChannelMatrix): RGBArray => [r, g, b]
export const matrixToPIXI = ({ r, g, b }: ChannelMatrix): number => to_pixi([r, g, b])

export const random_near = ([r, g, b]: RGBArray, step: number = 10, count: number = 2): RGBArray => {
  return forRGB([r, g, b], e => randomChannel(e, step, count))
}

export const random = ([r, g, b]: RGBArray, step: number = 10): RGBArray => {
  return forRGB([r, g, b], e => randomByFloor(e, step))
}

export const brighter = ([r, g, b]: RGBArray, step: number = 10): RGBArray => {
  return forRGB([r, g, b], e => Math.min(e + step, 255))
}

export const darker = ([r, g, b]: RGBArray, step: number = 10): RGBArray => {
  return forRGB([r, g, b], e => Math.max(e - step, 0))
}

export const to_pixi = ([r, g, b]: RGBArray): number => {
  /* eslint-disable-next-line no-bitwise */
  return (r << 16) + (g << 8) + b
}

type Order = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export const allChannelMatrixes = (order: Order = 1, withMonochrome: boolean = false): Array<ChannelMatrix> => {
  if (order < 0 || order > 8) {
    throw new Error('order shold be from 0 to 8')
  }
  const step = 256 / (2 ** order)
  const cnt = 256 / step
  // 0 is a special case, Math.max(v, 0) for it
  const multis = R.map(i => Math.max(i * step - 1, 0), R.range(0, cnt + 1))
  // console.log('LIST', order, step, cnt, multis)
  return matrixesByValuesList(multis, withMonochrome)
}

const matrixesByValuesList = (list: Array<number>, withMonochrome: boolean = false): Array<ChannelMatrix> => {
  const all = R.chain(
    r => R.chain(
      g => R.map(
        b => ({ r, g, b })
      )(list)
    )(list)
  )(list)
  if (withMonochrome) {
    return all
  }
  return R.filter(({ r, g, b }) => !(r === g && r === b && g === b), all)
}

export const forRGB = ([r, g, b]: RGBArray, func: (number) => number): RGBArray => [func(r), func(g), func(b)]

const randomChannel = (base, step, count) => {
  const rand = step * randInt(-count, count)
  const res = base + rand
  // return res > 255 ? 255 : res < 0 ? 0 : res
  return Math.min(255, Math.max(0, res))
}

const randomByFloor = (floor: number, step: number): number => floor - step * randInt(0, Math.floor(floor / step))
